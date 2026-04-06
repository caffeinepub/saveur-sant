import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MealPlan {
    description_en: string;
    description_fr: string;
    recipe_ids: Array<bigint>;
    difficulty: Variant_easy_hard_medium;
    duration_days: bigint;
    diet_type: Variant_non_vegetarian_vegetarian;
    name_en: string;
    name_fr: string;
    price: bigint;
}
export interface Recipe {
    prep_time_min: bigint;
    description_en: string;
    description_fr: string;
    image_url: string;
    difficulty: Variant_easy_hard_medium;
    diet_type: Variant_non_vegetarian_vegetarian;
    name_en: string;
    name_fr: string;
    category: Variant_breakfast_lunch_snack_dinner;
    steps_en: Array<string>;
    steps_fr: Array<string>;
    ingredients_en: Array<string>;
    ingredients_fr: Array<string>;
    nutrition: {
        fat: bigint;
        carbs: bigint;
        calories: bigint;
        protein: bigint;
    };
}
export enum Variant_breakfast_lunch_snack_dinner {
    breakfast = "breakfast",
    lunch = "lunch",
    snack = "snack",
    dinner = "dinner"
}
export enum Variant_easy_hard_medium {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum Variant_non_vegetarian_vegetarian {
    non_vegetarian = "non_vegetarian",
    vegetarian = "vegetarian"
}
export interface backendInterface {
    addMealPlan(mealPlan: MealPlan): Promise<bigint>;
    addRecipe(recipe: Recipe): Promise<bigint>;
    chatbot(message: string): Promise<string>;
    getAllMealPlans(): Promise<Array<MealPlan>>;
    getAllRecipes(): Promise<Array<Recipe>>;
    getMealPlan(id: bigint): Promise<MealPlan>;
    getMealPlanRecommendations(dietType: Variant_non_vegetarian_vegetarian): Promise<Array<MealPlan>>;
    getRecipe(id: bigint): Promise<Recipe>;
    getRecipesByCategory(category: Variant_breakfast_lunch_snack_dinner): Promise<Array<Recipe>>;
}
