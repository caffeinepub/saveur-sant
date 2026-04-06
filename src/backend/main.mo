import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";

actor {
  type Language = {
    #english;
    #french;
  };

  type MealPlan = {
    name_en : Text;
    name_fr : Text;
    description_en : Text;
    description_fr : Text;
    diet_type : {
      #vegetarian;
      #non_vegetarian;
    };
    difficulty : {
      #easy;
      #medium;
      #hard;
    };
    price : Nat;
    duration_days : Nat;
    recipe_ids : [Nat];
  };

  module MealPlan {
    public func compare(a : MealPlan, b : MealPlan) : Order.Order {
      Text.compare(a.name_en, b.name_en);
    };
  };

  type Recipe = {
    name_en : Text;
    name_fr : Text;
    description_en : Text;
    description_fr : Text;
    ingredients_en : [Text];
    ingredients_fr : [Text];
    steps_en : [Text];
    steps_fr : [Text];
    nutrition : {
      calories : Nat;
      protein : Nat;
      carbs : Nat;
      fat : Nat;
    };
    prep_time_min : Nat;
    difficulty : {
      #easy;
      #medium;
      #hard;
    };
    category : {
      #breakfast;
      #lunch;
      #dinner;
      #snack;
    };
    diet_type : {
      #vegetarian;
      #non_vegetarian;
    };
    image_url : Text;
  };

  module Recipe {
    public func compare(a : Recipe, b : Recipe) : Order.Order {
      Text.compare(a.name_en, b.name_en);
    };
  };

  let mealPlans = Map.empty<Nat, MealPlan>();
  let recipes = Map.empty<Nat, Recipe>();

  var nextMealPlanId = 1;
  var nextRecipeId = 1;

  public query ({ caller }) func getMealPlan(id : Nat) : async MealPlan {
    switch (mealPlans.get(id)) {
      case (null) { Runtime.trap("Meal plan not found.") };
      case (?plan) { plan };
    };
  };

  public query ({ caller }) func getAllMealPlans() : async [MealPlan] {
    mealPlans.values().toArray().sort();
  };

  public query ({ caller }) func getRecipe(id : Nat) : async Recipe {
    switch (recipes.get(id)) {
      case (null) { Runtime.trap("Recipe not found.") };
      case (?recipe) { recipe };
    };
  };

  public query ({ caller }) func getAllRecipes() : async [Recipe] {
    recipes.values().toArray().sort();
  };

  public shared ({ caller }) func addRecipe(recipe : Recipe) : async Nat {
    let id = nextRecipeId;
    nextRecipeId += 1;
    recipes.add(id, recipe);
    id;
  };

  public shared ({ caller }) func addMealPlan(mealPlan : MealPlan) : async Nat {
    let id = nextMealPlanId;
    nextMealPlanId += 1;
    mealPlans.add(id, mealPlan);
    id;
  };

  let nutritionQuestions : [(Text, Text, Text)] = [
    (
      "vegetarian",
      "A vegetarian diet can provide all essential nutrients if well-balanced. Focus on legumes, whole grains, and a variety of fruits and vegetables.",
      "Un régime végétarien peut fournir tous les nutriments essentiels s'il est bien équilibré. Concentrez-vous sur les légumineuses, les grains entiers et une variété de fruits et légumes.",
    ),
    (
      "calories",
      "Calorie needs vary by individual. Track your intake based on your activity level and goals.",
      "Les besoins caloriques varient d'une personne à l'autre. Suivez votre apport en fonction de votre niveau d'activité et de vos objectifs.",
    ),
    (
      "hydration",
      "Staying hydrated is crucial for health. Aim for at least 1.5-2 liters of water daily.",
      "Rester hydraté est essentiel pour la santé. Visez au moins 1,5 à 2 litres d'eau par jour.",
    ),
    (
      "protein",
      "Good sources of protein include lean meats, fish, eggs, dairy, legumes, and nuts.",
      "Les bonnes sources de protéines incluent les viandes maigres, le poisson, les œufs, les produits laitiers, les légumineuses et les noix.",
    ),
    (
      "french cuisine",
      "Healthy French cuisine focuses on balance. Opt for more vegetables, moderate portions, and limit heavy sauces.",
      "La cuisine française saine mise sur l'équilibre. Optez pour plus de légumes, des portions modérées et limitez les sauces riches.",
    ),
  ];

  func detectLanguage(message : Text) : Language {
    let frenchKeywords = ["bonjour", "français", "santé", "végétarien", "calories"];
    for (keyword in frenchKeywords.values()) {
      if (message.contains(#text keyword)) {
        return #french;
      };
    };
    #english;
  };

  public query ({ caller }) func chatbot(message : Text) : async Text {
    let language = detectLanguage(message);
    for ((keyword, englishResponse, frenchResponse) in nutritionQuestions.values()) {
      if (message.contains(#text keyword)) {
        return switch (language) {
          case (#english) { englishResponse };
          case (#french) { frenchResponse };
        };
      };
    };
    switch (language) {
      case (#english) { "Sorry, I couldn't find an answer. Please ask a different question!" };
      case (#french) { "Désolé, je n'ai pas trouvé de réponse. Veuillez poser une autre question !" };
    };
  };

  public shared ({ caller }) func getMealPlanRecommendations(dietType : { #vegetarian; #non_vegetarian }) : async [MealPlan] {
    let filtered = List.empty<MealPlan>();
    for (plan in mealPlans.values()) {
      if (plan.diet_type == dietType) {
        filtered.add(plan);
      };
    };
    filtered.toArray().sort();
  };

  public query ({ caller }) func getRecipesByCategory(category : { #breakfast; #lunch; #dinner; #snack }) : async [Recipe] {
    let filtered = List.empty<Recipe>();
    for (recipe in recipes.values()) {
      if (recipe.category == category) {
        filtered.add(recipe);
      };
    };
    filtered.toArray().sort();
  };
};
