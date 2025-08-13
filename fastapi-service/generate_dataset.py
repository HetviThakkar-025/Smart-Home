# generate_dataset.py
import pandas as pd
import random

# Sample ingredients
ingredients_list = [
    "chicken", "beef", "pork", "salmon", "tofu", "lentils", "chickpeas",
    "rice", "pasta", "bread", "potato", "carrot", "peas", "spinach",
    "broccoli", "cheese", "milk", "egg", "yogurt", "nuts", "apple", "banana"
]

meals = []

for i in range(1000):  # generate 1000 meals
    num_ingredients = random.randint(2, 6)
    meal_ingredients = random.sample(ingredients_list, num_ingredients)
    meal_name = " ".join(meal_ingredients)

    # Generate synthetic nutrition values
    calories = round(random.uniform(100, 800), 1)
    protein = round(random.uniform(2, 50), 1)
    carbs = round(random.uniform(5, 100), 1)
    fat = round(random.uniform(1, 40), 1)
    fiber = round(random.uniform(0, 15), 1)

    meals.append({
        "meal": meal_name,
        "calories": calories,
        "protein": protein,
        "carbs": carbs,
        "fat": fat,
        "fiber": fiber
    })

df = pd.DataFrame(meals)
df.to_csv("synthetic_meals.csv", index=False)
print("Synthetic dataset saved to synthetic_meals.csv")
