import os
import numpy as np
import re
import time
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal
import joblib
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
import requests
from meal_scheduler import generate_daily_schedule
from dotenv import load_dotenv
load_dotenv()
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
# print(SPOONACULAR_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and embedder at startup
package = joblib.load('model.pkl')
clf = package['classifier']
embedder = package['embedder']
print("Loaded embedder")
# Pet comfort model
pet_comfort_model = joblib.load('pet_comfort_model.pkl')
print("Loaded Pet model")

pet_health_package = joblib.load("pet_health_model.pkl")
pet_health_model = pet_health_package["model"]
pet_health_encoder = pet_health_package["encoder"]
print("Loaded pet_health_model")

pet_diet_package = joblib.load("pet_diet_model.pkl")
pet_diet_model = pet_diet_package["model"]
pet_diet_encoder = pet_diet_package["encoder"]
pet_food_map = pet_diet_package["food_map"]
print("Loaded pet_diet_model")


class TextRequest(BaseModel):
    text: str


class PetComfortRequest(BaseModel):
    temperature: float
    humidity: float
    feeding_interval: int
    activity_level: int


class PetHealthRequest(BaseModel):
    symptoms: str
    recentFood: str
    recentActivity: str


class PetDietRequest(BaseModel):
    breed: str
    weight: float
    activity: int


class RecipeRequest(BaseModel):
    ingredients: str
    diet: str = "vegetarian"  # default to vegetarian
    type: str = "main course"


class NutritionRequest(BaseModel):
    meal: str


class MealScheduleRequest(BaseModel):
    preferences: str = "vegetarian"  # vegetarian / low-carb / high-protein
    meals_per_day: int = 3


@app.post('/predict_urgency')
def predict_urgency(req: TextRequest):
    text = req.text.lower()
    embedding = embedder.encode([text])
    prediction = clf.predict(embedding)[0]
    return {'urgency': prediction}


@app.post('/predict_pet_comfort')
def predict_pet_comfort(req: PetComfortRequest):
    features = [[
        req.temperature,
        req.humidity,
        req.feeding_interval,
        req.activity_level
    ]]
    prediction = pet_comfort_model.predict(features)[0]

    print('comfort_level', prediction)
    return {'comfort_level': prediction}


@app.post("/predict_pet_health")
def predict_pet_health(req: PetHealthRequest):
    # Match training order: ["symptom", "food_type"]
    X_cat = pet_health_encoder.transform([[req.symptoms, req.recentFood]])

    # Match training numerical features: ["food_amount", "activity"]
    # Here I assumed food_amount = len(symptoms.split()) just for placeholder
    X_num = [[len(req.symptoms.split()), int(req.recentActivity)]]

    X = np.hstack([X_cat, X_num])

    pred = pet_health_model.predict(X)[0]
    # pred = pred.upper()
    print("risk", pred)
    return {"risk": pred}


@app.post("/recommend_pet_diet")
def recommend_pet_diet(req: PetDietRequest):
    X_cat = pet_diet_encoder.transform([[req.breed]])
    X_num = [[req.weight, req.activity]]
    X = np.hstack([X_cat, X_num])
    portion = pet_diet_model.predict(X)[0]
    food_type = pet_food_map.get(req.breed, "dry_kibble")
    print("risk", portion)
    print("risk", food_type)
    return {
        "recommended_portion_g": round(portion, 1),
        "recommended_food_type": food_type
    }


@app.post("/recipe-generator")
def generate_recipe(req: RecipeRequest):
    ingredients_list = [ing.strip()
                        for ing in req.ingredients.split(",") if ing.strip()]
    if not ingredients_list:
        raise HTTPException(status_code=400, detail="No ingredients provided.")

    try:
        # Build the ingredient string
        ingredients_str = ",".join(ingredients_list)

        # Step 1: Search for recipes
        search_url = "https://api.spoonacular.com/recipes/complexSearch"
        search_params = {
            "includeIngredients": ingredients_str,
            "diet": req.diet,
            "type": req.type,
            "number": 5,  # fetch top 5 results
            "apiKey": SPOONACULAR_API_KEY
        }
        search_res = requests.get(search_url, params=search_params)
        search_data = search_res.json()

        if not search_data.get("results"):
            return {"recipe": f"No {req.diet} recipe found for given ingredients."}

        # Step 2: Get full recipe details for the first recipe
        recipe_id = search_data["results"][0]["id"]
        detail_url = f"https://api.spoonacular.com/recipes/{recipe_id}/information"
        detail_res = requests.get(
            detail_url, params={"apiKey": SPOONACULAR_API_KEY})
        detail_data = detail_res.json()

        # Step 3: Extract ingredients list
        ingredients = []
        for ing in detail_data.get("extendedIngredients", []):
            amount = f"{ing.get('amount', '')} {ing.get('unit', '')}".strip()
            name = ing.get("name", "")
            ingredients.append(f"{amount} {name}".strip())

        # Step 4: Build response JSON
        recipe_json = {
            "title": detail_data.get("title"),
            "category": req.diet.capitalize(),
            "area": detail_data.get("cuisines", []),
            "instructions": detail_data.get("instructions", ""),
            "image": detail_data.get("image"),
            "ingredients": ingredients
        }

        return {"recipe": recipe_json}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Helper functions for nutrition parsing/aggregation ---


def _sum_nutrients_from_spoonacular_items(items):
    total = {"calories": 0.0, "protein_g": 0.0,
             "carbs_g": 0.0, "fat_g": 0.0, "fiber_g": 0.0}
    for item in items:
        nutrition = item.get("nutrition", {}) or {}
        nutrients = nutrition.get("nutrients", []) or []
        for n in nutrients:
            name = n.get("name", "").lower()
            amount = n.get("amount", 0) or 0
            if "calories" in name:
                total["calories"] += amount
            elif "protein" in name:
                total["protein_g"] += amount
            elif "carbohydrates" in name:
                total["carbs_g"] += amount
            elif name == "fat":
                total["fat_g"] += amount
            elif "fiber" in name:
                total["fiber_g"] += amount
    return total


def _aggregate_dicts(a, b):
    return {k: a.get(k, 0) + b.get(k, 0) for k in set(a) | set(b)}


def _parse_quantity_and_name(ing_text):
    """
    Heuristic to extract a grams amount (approx) and normalized name from a text like:
      "2 cups spinach" -> (480.0, "spinach")  # 2 * 240
      "100 g chicken" -> (100.0, "chicken")
      "1 tbsp olive oil" -> (15.0, "olive oil")
    Returns (grams_or_None, ingredient_name)
    """
    s = ing_text.strip().lower()
    s = re.sub(r'\s+', ' ', s)

    # try to catch patterns like '1/2', '2.5', '100g', etc.
    m = re.match(
        r'^(\d+(?:\.\d+)?|\d+/\d+)\s*(g|gram|grams|kg|kilogram|ml|tbsp|tbsp\.|tsp|cup|cups)?\s*(.*)$', s)
    if m:
        qty = m.group(1)
        unit = m.group(2)
        name = m.group(3).strip() or s
        try:
            if '/' in qty:
                a, b = qty.split('/')
                qty_val = float(a) / float(b)
            else:
                qty_val = float(qty)
        except:
            qty_val = None

        if unit:
            unit = unit.replace('.', '')
            if unit in ("g", "gram", "grams"):
                return qty_val, name
            if unit in ("kg", "kilogram"):
                return qty_val * 1000, name
            if unit in ("ml",):
                return qty_val, name
            if unit in ("tbsp",):
                return qty_val * 15, name
            if unit in ("tsp",):
                return qty_val * 5, name
            if unit in ("cup", "cups"):
                return qty_val * 240, name
        if qty_val is not None:
            return qty_val, name

    # numeric prefix without unit
    m2 = re.match(r'^(\d+(?:\.\d+)?)\s+(.*)$', s)
    if m2:
        try:
            val = float(m2.group(1))
            name = m2.group(2).strip()
            # assume grams for a bare number (best effort)
            return val, name
        except:
            pass

    # fallback: no qty
    return None, s


@app.post("/nutrition")
def track_nutrition(req: NutritionRequest):
    meal_text = (req.meal or "").strip()
    if not meal_text:
        raise HTTPException(status_code=400, detail="Meal text required.")

    if not SPOONACULAR_API_KEY:
        raise HTTPException(
            status_code=500, detail="SPOONACULAR_API_KEY not set on server")

    try:
        # Attempt 1: parseIngredients (preferred)
        parse_url = "https://api.spoonacular.com/recipes/parseIngredients"
        ingredient_list_payload = meal_text.replace(",", "\n")
        payload = {"ingredientList": ingredient_list_payload, "servings": 1}
        resp = requests.post(parse_url, params={
                             "apiKey": SPOONACULAR_API_KEY}, data=payload, timeout=15)
        print("parseIngredients status:", resp.status_code)
        try:
            parsed = resp.json()
        except Exception as ex:
            parsed = None
            print("parseIngredients json decode error:", ex, resp.text)

        if isinstance(parsed, list) and len(parsed) > 0:
            total = _sum_nutrients_from_spoonacular_items(parsed)
            if any(v > 0 for v in total.values()):
                print("Using parseIngredients totals:", total)
                return {"nutrition": {k: round(v, 1) for k, v in total.items()}}
            else:
                print(
                    "parseIngredients returned items but nutrients are zero; falling back.")
        else:
            print("parseIngredients returned empty/invalid:", parsed)

        # Fallback: search each ingredient and fetch per-gram nutrition
        candidates = [c.strip()
                      for c in re.split(r'[,\n]+', meal_text) if c.strip()]
        fallback_total = {"calories": 0.0, "protein_g": 0.0,
                          "carbs_g": 0.0, "fat_g": 0.0, "fiber_g": 0.0}

        for cand in candidates:
            grams, name = _parse_quantity_and_name(cand)
            if grams is None or grams <= 0:
                grams = 100.0  # default fallback weight

            print(
                f"Fallback lookup for '{cand}' -> name='{name}' amount={grams}g")

            search_url = "https://api.spoonacular.com/food/ingredients/search"
            sresp = requests.get(search_url, params={
                                 "apiKey": SPOONACULAR_API_KEY, "query": name, "number": 1}, timeout=10)
            print("ingredient search status:", sresp.status_code)
            if sresp.status_code != 200:
                print("ingredient search failed:",
                      sresp.status_code, sresp.text)
                continue
            sdata = sresp.json()
            results = sdata.get("results") or []
            if len(results) == 0:
                print("no search result for", name)
                continue
            ing_id = results[0].get("id")
            if not ing_id:
                print("no id for", name)
                continue

            info_url = f"https://api.spoonacular.com/food/ingredients/{ing_id}/information"
            iresp = requests.get(info_url, params={
                                 "apiKey": SPOONACULAR_API_KEY, "amount": grams, "unit": "grams"}, timeout=10)
            print("ingredient info status:", iresp.status_code)
            if iresp.status_code != 200:
                print("ingredient info failed:", iresp.status_code, iresp.text)
                continue
            idata = iresp.json()
            nutrients = idata.get("nutrition", {}).get("nutrients", []) or []
            per_item = {"calories": 0.0, "protein_g": 0.0,
                        "carbs_g": 0.0, "fat_g": 0.0, "fiber_g": 0.0}
            for n in nutrients:
                nm = n.get("name", "").lower()
                amt = n.get("amount", 0) or 0
                if "calories" in nm:
                    per_item["calories"] += amt
                elif "protein" in nm:
                    per_item["protein_g"] += amt
                elif "carbohydrates" in nm:
                    per_item["carbs_g"] += amt
                elif nm == "fat":
                    per_item["fat_g"] += amt
                elif "fiber" in nm:
                    per_item["fiber_g"] += amt

            print(f"ingredient '{name}' -> {per_item}")
            fallback_total = _aggregate_dicts(fallback_total, per_item)
            time.sleep(0.12)  # polite pause for rate limits

        if any(v > 0 for v in fallback_total.values()):
            print("Returning fallback totals:", fallback_total)
            return {"nutrition": {k: round(v, 1) for k, v in fallback_total.items()}}

        # final fallback: return zeros (wrapped)
        print("No nutrient info found. Returning zeros.")
        return {"nutrition": {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0, "fiber_g": 0}}

    except HTTPException:
        raise
    except Exception as e:
        print("Unexpected error in /nutrition:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/meal-schedule")
def meal_schedule(req: MealScheduleRequest):
    try:
        plan = generate_daily_schedule(req.preferences, req.meals_per_day)
        return {"schedule": plan["schedule"], "shopping_list": plan["shopping_list"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def root():
    return {"message": "FastAPI service running for urgency & pet comfort predictions"}
