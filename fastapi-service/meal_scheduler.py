# meal_scheduler.py
import random
from datetime import datetime
from typing import List, Dict

# Large vegetarian meals database
VEG_MEALS_DB = {
    "vegetarian": [
        {"name": "Oatmeal with Fruits", "ingredients": [
            "oats", "banana", "almonds", "milk"]},
        {"name": "Quinoa Salad", "ingredients": [
            "quinoa", "cucumber", "tomato", "olive oil"]},
        {"name": "Grilled Veggies with Tofu", "ingredients": [
            "tofu", "zucchini", "bell pepper", "olive oil"]},
        {"name": "Greek Yogurt with Berries", "ingredients": [
            "greek yogurt", "blueberries", "honey"]},
        {"name": "Lentil Soup", "ingredients": [
            "lentils", "carrot", "onion", "garlic"]},
        {"name": "Veggie Stir Fry", "ingredients": [
            "broccoli", "carrot", "capsicum", "soy sauce"]},
        {"name": "Chickpea Curry", "ingredients": [
            "chickpeas", "tomato", "onion", "spices"]},
        {"name": "Paneer Tikka", "ingredients": [
            "paneer", "bell pepper", "yogurt", "spices"]},
        {"name": "Spinach Soup", "ingredients": [
            "spinach", "garlic", "cream"]},
        {"name": "Mushroom Risotto", "ingredients": [
            "rice", "mushroom", "parmesan", "olive oil"]},
        {"name": "Stuffed Zucchini Boats", "ingredients": [
            "zucchini", "tomato", "cheese", "herbs"]},
        {"name": "Sweet Potato Curry", "ingredients": [
            "sweet potato", "coconut milk", "spices"]},
        {"name": "Vegetable Paella", "ingredients": [
            "rice", "bell pepper", "peas", "saffron"]},
        {"name": "Caprese Salad", "ingredients": [
            "tomato", "mozzarella", "basil", "olive oil"]},
        {"name": "Veggie Burger", "ingredients": [
            "burger bun", "black beans", "lettuce", "tomato", "onion"]},
        {"name": "Cabbage Soup", "ingredients": [
            "cabbage", "carrot", "celery", "tomato"]},
        {"name": "Falafel Wrap", "ingredients": [
            "chickpeas", "tortilla", "lettuce", "tomato", "tahini"]},
        {"name": "Vegetable Lasagna", "ingredients": [
            "pasta sheets", "spinach", "ricotta", "tomato sauce"]},
        {"name": "Butternut Squash Soup", "ingredients": [
            "butternut squash", "onion", "cream", "spices"]},
        {"name": "Avocado Toast", "ingredients": [
            "bread", "avocado", "tomato", "olive oil"]},
    ],
    "low-carb": [
        {"name": "Zucchini Noodles with Pesto",
            "ingredients": ["zucchini", "pesto", "parmesan"]},
        {"name": "Tofu & Veggie Stir Fry", "ingredients": [
            "tofu", "broccoli", "bell pepper", "soy sauce"]},
        {"name": "Cauliflower Rice Bowl", "ingredients": [
            "cauliflower", "carrot", "peas", "spices"]},
        {"name": "Eggplant Parmesan", "ingredients": [
            "eggplant", "tomato sauce", "mozzarella", "parmesan"]},
        {"name": "Avocado Salad", "ingredients": [
            "avocado", "cucumber", "spinach", "olive oil"]},
        {"name": "Mushroom Lettuce Wraps", "ingredients": [
            "mushroom", "lettuce", "soy sauce", "garlic"]},
        {"name": "Paneer Salad", "ingredients": [
            "paneer", "spinach", "tomato", "olive oil"]},
        {"name": "Broccoli Soup", "ingredients": [
            "broccoli", "cream", "garlic", "onion"]},
        {"name": "Stuffed Bell Peppers", "ingredients": [
            "bell pepper", "quinoa", "tomato", "spices"]},
        {"name": "Cabbage Stir Fry", "ingredients": [
            "cabbage", "carrot", "soy sauce", "garlic"]},
    ],
    "high-protein": [
        {"name": "Protein Smoothie", "ingredients": [
            "protein powder", "milk", "banana", "peanut butter"]},
        {"name": "Tofu Quinoa Bowl", "ingredients": [
            "tofu", "quinoa", "broccoli", "olive oil"]},
        {"name": "Paneer & Spinach Stir Fry", "ingredients": [
            "paneer", "spinach", "garlic", "olive oil"]},
        {"name": "Chickpea & Veggie Bowl", "ingredients": [
            "chickpeas", "zucchini", "tomato", "olive oil"]},
        {"name": "Lentil & Veggie Salad", "ingredients": [
            "lentils", "cucumber", "tomato", "olive oil"]},
        {"name": "Greek Yogurt Parfait", "ingredients": [
            "greek yogurt", "almonds", "blueberries"]},
        {"name": "Edamame Salad", "ingredients": [
            "edamame", "spinach", "olive oil", "lemon"]},
        {"name": "Peanut Butter Oatmeal", "ingredients": [
            "oats", "peanut butter", "milk", "banana"]},
        {"name": "Cottage Cheese Salad", "ingredients": [
            "cottage cheese", "tomato", "cucumber", "olive oil"]},
        {"name": "Seitan Stir Fry", "ingredients": [
            "seitan", "broccoli", "bell pepper", "soy sauce"]},
    ]
}


def generate_daily_schedule(preference: str = "vegetarian", meals_per_day: int = 3) -> Dict:
    """
    Returns today's meal schedule and shopping list
    """
    preference = preference.lower()
    if preference not in VEG_MEALS_DB:
        preference = "vegetarian"

    # Get today's day name, e.g., "Wednesday"
    today = datetime.today().strftime("%A")

    daily_meals = random.sample(VEG_MEALS_DB[preference], k=min(
        meals_per_day, len(VEG_MEALS_DB[preference])))

    schedule = {
        today: [
            {"meal": m["name"], "ingredients": m["ingredients"]} for m in daily_meals
        ]
    }

    # Aggregate ingredients for shopping list
    shopping_list = {}
    for m in daily_meals:
        for ing in m["ingredients"]:
            shopping_list[ing] = shopping_list.get(
                ing, 0) + 1  # count occurrence

    return {"schedule": schedule, "shopping_list": shopping_list}
