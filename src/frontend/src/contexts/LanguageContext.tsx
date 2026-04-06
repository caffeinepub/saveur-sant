import { type ReactNode, createContext, useContext, useState } from "react";

export type Language = "fr" | "en";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.plans": "Plans Repas",
    "nav.recipes": "Recettes",
    "nav.about": "À Propos",
    "nav.language": "English",

    // Hero
    "hero.headline1": "Savourez la Santé,",
    "hero.headline2": "À la Française",
    "hero.subtitle":
      "Discover personalized healthy meal plans inspired by authentic French cuisine",
    "hero.cta.primary": "Découvrir nos Plans",
    "hero.cta.secondary": "Explorer les Recettes",

    // Meal Plans Section
    "plans.title": "Nos Plans Repas Hebdomadaires",
    "plans.subtitle":
      "Des plans nutritionnels équilibrés inspirés de la cuisine française",
    "plans.filter.all": "Tous",
    "plans.filter.vegetarian": "Végétarien",
    "plans.filter.non_vegetarian": "Non-Végétarien",
    "plans.card.per_week": "/ semaine",
    "plans.card.days": "jours",
    "plans.card.cta": "Voir le Plan",
    "plans.card.difficulty.easy": "Facile",
    "plans.card.difficulty.medium": "Moyen",
    "plans.card.difficulty.hard": "Difficile",
    "plans.card.diet.vegetarian": "VÉGÉTARIEN",
    "plans.card.diet.non_vegetarian": "CLASSIQUE",
    "plans.loading": "Chargement des plans...",
    "plans.empty": "Aucun plan disponible pour le moment.",

    // Recipes Section
    "recipes.title": "Recettes Vedettes",
    "recipes.subtitle": "Des recettes saines et délicieuses pour chaque repas",
    "recipes.card.minutes": "min",
    "recipes.card.cta": "Voir la Recette",
    "recipes.loading": "Chargement des recettes...",
    "recipes.empty": "Aucune recette disponible pour le moment.",
    "recipes.category.breakfast": "Petit-déjeuner",
    "recipes.category.lunch": "Déjeuner",
    "recipes.category.dinner": "Dîner",
    "recipes.category.snack": "Collation",

    // Recipe Modal
    "recipe.modal.ingredients": "Ingrédients",
    "recipe.modal.steps": "Étapes de Préparation",
    "recipe.modal.nutrition": "Informations Nutritionnelles",
    "recipe.modal.calories": "Calories",
    "recipe.modal.protein": "Protéines",
    "recipe.modal.carbs": "Glucides",
    "recipe.modal.fat": "Lipides",
    "recipe.modal.prep_time": "Temps de préparation",
    "recipe.modal.difficulty": "Difficulté",
    "recipe.modal.category": "Catégorie",
    "recipe.modal.diet": "Régime",

    // Meal Plan Modal
    "plan.modal.duration": "Durée",
    "plan.modal.days": "jours",
    "plan.modal.difficulty": "Difficulté",
    "plan.modal.price": "Prix",
    "plan.modal.per_week": "/ semaine",
    "plan.modal.diet": "Régime alimentaire",
    "plan.modal.recipes": "Recettes Incluses",
    "plan.modal.recipes_count": "recettes au programme",
    "plan.modal.cta": "Commencer ce Plan",

    // Chatbot
    "chat.title": "Saveur BOT",
    "chat.subtitle": "Votre assistant nutrition",
    "chat.greeting":
      "Bonjour! Je suis votre assistant nutrition. Comment puis-je vous aider aujourd'hui?",
    "chat.placeholder": "Posez votre question...",
    "chat.send": "Envoyer",
    "chat.thinking": "En train de réfléchir...",

    // Footer
    "footer.tagline": "L'art de manger sainement, à la française.",
    "footer.links.plans": "Plans Repas",
    "footer.links.recipes": "Recettes",
    "footer.links.about": "À Propos",
    "footer.links.contact": "Contact",
    "footer.links.privacy": "Confidentialité",
    "footer.links.terms": "Conditions",
    "footer.copyright": "© {year}. Built with love using caffeine.ai",

    // About Section
    "about.title": "Notre Philosophie",
    "about.subtitle":
      "Allier le plaisir culinaire français à une alimentation équilibrée et saine",
    "about.card1.title": "Cuisine Authentique",
    "about.card1.desc":
      "Des recettes traditionnelles françaises revisitées pour le bien-être moderne.",
    "about.card2.title": "Nutritionnellement Équilibré",
    "about.card2.desc":
      "Chaque plan est élaboré par des nutritionnistes pour garantir un équilibre optimal.",
    "about.card3.title": "Pour Tous",
    "about.card3.desc":
      "Options végétariennes et non-végétariennes pour s'adapter à vos préférences.",

    // Personalized Plan Section
    "personal.title": "Votre Plan Personnalisé",
    "personal.subtitle":
      "Entrez votre taille et votre poids pour obtenir un plan adapté",
    "personal.unit.metric": "Métrique",
    "personal.unit.imperial": "Impérial",
    "personal.height": "Taille",
    "personal.height.cm": "Taille (cm)",
    "personal.height.ft": "Pieds",
    "personal.height.in": "Pouces",
    "personal.weight": "Poids",
    "personal.weight.kg": "Poids (kg)",
    "personal.weight.lbs": "Poids (lbs)",
    "personal.calculate": "Calculer mon IMC",
    "personal.bmi.result": "Votre IMC",
    "personal.bmi.underweight": "Insuffisance pondérale",
    "personal.bmi.normal": "Poids normal",
    "personal.bmi.overweight": "Surpoids",
    "personal.bmi.obese": "Obèse",
    "personal.recommendation": "Plan recommandé",
    "personal.recommendation.desc":
      "Basé sur votre profil, nous vous recommandons ce plan :",
    "personal.view.plan": "Voir le Plan",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.plans": "Meal Plans",
    "nav.recipes": "Recipes",
    "nav.about": "About",
    "nav.language": "Français",

    // Hero
    "hero.headline1": "Savor Health,",
    "hero.headline2": "The French Way",
    "hero.subtitle":
      "Discover personalized healthy meal plans inspired by authentic French cuisine",
    "hero.cta.primary": "Explore Meal Plans",
    "hero.cta.secondary": "Browse Recipes",

    // Meal Plans Section
    "plans.title": "Our Weekly Meal Plans",
    "plans.subtitle": "Balanced nutritional plans inspired by French cuisine",
    "plans.filter.all": "All",
    "plans.filter.vegetarian": "Vegetarian",
    "plans.filter.non_vegetarian": "Non-Vegetarian",
    "plans.card.per_week": "/ week",
    "plans.card.days": "days",
    "plans.card.cta": "View Plan",
    "plans.card.difficulty.easy": "Easy",
    "plans.card.difficulty.medium": "Medium",
    "plans.card.difficulty.hard": "Hard",
    "plans.card.diet.vegetarian": "VEGETARIAN",
    "plans.card.diet.non_vegetarian": "CLASSIC",
    "plans.loading": "Loading plans...",
    "plans.empty": "No plans available at the moment.",

    // Recipes Section
    "recipes.title": "Featured Recipes",
    "recipes.subtitle": "Healthy and delicious recipes for every meal",
    "recipes.card.minutes": "min",
    "recipes.card.cta": "View Recipe",
    "recipes.loading": "Loading recipes...",
    "recipes.empty": "No recipes available at the moment.",
    "recipes.category.breakfast": "Breakfast",
    "recipes.category.lunch": "Lunch",
    "recipes.category.dinner": "Dinner",
    "recipes.category.snack": "Snack",

    // Recipe Modal
    "recipe.modal.ingredients": "Ingredients",
    "recipe.modal.steps": "Preparation Steps",
    "recipe.modal.nutrition": "Nutritional Information",
    "recipe.modal.calories": "Calories",
    "recipe.modal.protein": "Protein",
    "recipe.modal.carbs": "Carbs",
    "recipe.modal.fat": "Fat",
    "recipe.modal.prep_time": "Prep time",
    "recipe.modal.difficulty": "Difficulty",
    "recipe.modal.category": "Category",
    "recipe.modal.diet": "Diet",

    // Meal Plan Modal
    "plan.modal.duration": "Duration",
    "plan.modal.days": "days",
    "plan.modal.difficulty": "Difficulty",
    "plan.modal.price": "Price",
    "plan.modal.per_week": "/ week",
    "plan.modal.diet": "Diet type",
    "plan.modal.recipes": "Included Recipes",
    "plan.modal.recipes_count": "recipes included",
    "plan.modal.cta": "Start This Plan",

    // Chatbot
    "chat.title": "Saveur BOT",
    "chat.subtitle": "Your nutrition assistant",
    "chat.greeting":
      "Hello! I'm your nutrition assistant. How can I help you today?",
    "chat.placeholder": "Ask your question...",
    "chat.send": "Send",
    "chat.thinking": "Thinking...",

    // Footer
    "footer.tagline": "The art of healthy eating, the French way.",
    "footer.links.plans": "Meal Plans",
    "footer.links.recipes": "Recipes",
    "footer.links.about": "About",
    "footer.links.contact": "Contact",
    "footer.links.privacy": "Privacy",
    "footer.links.terms": "Terms",
    "footer.copyright": "© {year}. Built with love using caffeine.ai",

    // About Section
    "about.title": "Our Philosophy",
    "about.subtitle":
      "Combining French culinary pleasure with balanced and healthy eating",
    "about.card1.title": "Authentic Cuisine",
    "about.card1.desc":
      "Traditional French recipes reinvented for modern wellness.",
    "about.card2.title": "Nutritionally Balanced",
    "about.card2.desc":
      "Every plan is crafted by nutritionists to ensure optimal balance.",
    "about.card3.title": "For Everyone",
    "about.card3.desc":
      "Vegetarian and non-vegetarian options to suit your preferences.",

    // Personalized Plan Section
    "personal.title": "Your Personalized Plan",
    "personal.subtitle": "Enter your height and weight to get a tailored plan",
    "personal.unit.metric": "Metric",
    "personal.unit.imperial": "Imperial",
    "personal.height": "Height",
    "personal.height.cm": "Height (cm)",
    "personal.height.ft": "Feet",
    "personal.height.in": "Inches",
    "personal.weight": "Weight",
    "personal.weight.kg": "Weight (kg)",
    "personal.weight.lbs": "Weight (lbs)",
    "personal.calculate": "Calculate my BMI",
    "personal.bmi.result": "Your BMI",
    "personal.bmi.underweight": "Underweight",
    "personal.bmi.normal": "Normal weight",
    "personal.bmi.overweight": "Overweight",
    "personal.bmi.obese": "Obese",
    "personal.recommendation": "Recommended Plan",
    "personal.recommendation.desc":
      "Based on your profile, we recommend this plan:",
    "personal.view.plan": "View Plan",
  },
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    const dict = translations[language] as Record<string, string>;
    return dict[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
