import { SAMPLE_MEAL_PLANS, SAMPLE_RECIPES } from "../data/sampleData";

type Language = "en" | "fr";

// ─── Language Detection ───────────────────────────────────────────────────────
const FRENCH_MARKERS = [
  "bonjour",
  "salut",
  "merci",
  "comment",
  "pouvez",
  "puis-je",
  "quel",
  "quelle",
  "recette",
  "régime",
  "végétarien",
  "calories",
  "protéines",
  "glucides",
  "lipides",
  "plan",
  "repas",
  "santé",
  "ingrédients",
  "étapes",
  "nutrition",
  "cuisson",
  "préparer",
  "manger",
  "aliments",
  "légumes",
  "viande",
  "poulet",
  "poisson",
  "salade",
  "soupe",
  "tarte",
  "quinoa",
  "oignon",
  "ratatouille",
  "est-ce",
  "avez",
  "vous",
  "je",
  "qu'est",
  "quels",
  "combien",
];

export function detectLanguage(message: string): Language {
  const lower = message.toLowerCase();
  let frScore = 0;
  for (const marker of FRENCH_MARKERS) {
    if (lower.includes(marker)) frScore++;
  }
  return frScore >= 1 ? "fr" : "en";
}

// ─── Response helpers ─────────────────────────────────────────────────────────
function r(en: string, fr: string, lang: Language) {
  return lang === "fr" ? fr : en;
}

// ─── Main chatbot function ────────────────────────────────────────────────────
export function getChatbotReply(message: string): string {
  const lang = detectLanguage(message);
  const lower = message.toLowerCase();

  // ── 1. Specific recipe lookup ────────────────────────────────────────────
  for (const recipe of SAMPLE_RECIPES) {
    const nameEn = recipe.name_en.toLowerCase();
    const nameFr = recipe.name_fr.toLowerCase();
    // Check if the message mentions this recipe
    if (
      lower.includes(nameEn) ||
      lower.includes(nameFr) ||
      // partial match on key words (e.g. "niçoise", "ratatouille", "quinoa")
      nameEn
        .split(" ")
        .some((w) => w.length > 4 && lower.includes(w)) ||
      nameFr.split(" ").some((w) => w.length > 4 && lower.includes(w))
    ) {
      const name = lang === "fr" ? recipe.name_fr : recipe.name_en;
      const desc =
        lang === "fr" ? recipe.description_fr : recipe.description_en;
      const ingredients =
        lang === "fr" ? recipe.ingredients_fr : recipe.ingredients_en;
      const steps = lang === "fr" ? recipe.steps_fr : recipe.steps_en;
      const cal = Number(recipe.nutrition.calories);
      const prot = Number(recipe.nutrition.protein);
      const carbs = Number(recipe.nutrition.carbs);
      const fat = Number(recipe.nutrition.fat);
      const prepMin = Number(recipe.prep_time_min);
      const diff = recipe.difficulty;
      const diffLabel =
        lang === "fr"
          ? ((
              { easy: "Facile", medium: "Moyen", hard: "Difficile" } as Record<
                string,
                string
              >
            )[String(Object.keys(diff)[0])] ?? "Moyen")
          : ((
              { easy: "Easy", medium: "Medium", hard: "Hard" } as Record<
                string,
                string
              >
            )[String(Object.keys(diff)[0])] ?? "Medium");

      // Decide what to show based on sub-question
      if (
        lower.includes("ingredient") ||
        lower.includes("ingrédient") ||
        lower.includes("need") ||
        lower.includes("besoin")
      ) {
        return r(
          `**${name}** — Ingredients:\n• ${ingredients.join("\n• ")}`,
          `**${name}** — Ingrédients:\n• ${ingredients.join("\n• ")}`,
          lang,
        );
      }
      if (
        lower.includes("step") ||
        lower.includes("étape") ||
        lower.includes("prepare") ||
        lower.includes("prépare") ||
        lower.includes("cook") ||
        lower.includes("cuire")
      ) {
        return r(
          `**${name}** — Steps:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
          `**${name}** — Étapes:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
          lang,
        );
      }
      if (
        lower.includes("calorie") ||
        lower.includes("nutrition") ||
        lower.includes("protein") ||
        lower.includes("protéine") ||
        lower.includes("macros")
      ) {
        return r(
          `**${name}** — Nutrition per serving:\nCalories: ${cal} kcal | Protein: ${prot}g | Carbs: ${carbs}g | Fat: ${fat}g`,
          `**${name}** — Nutrition par portion:\nCalories: ${cal} kcal | Protéines: ${prot}g | Glucides: ${carbs}g | Lipides: ${fat}g`,
          lang,
        );
      }
      // Default: full recipe summary
      return r(
        `**${name}**\n${desc}\n\n⏱ Prep: ${prepMin} min | 🔥 ${cal} kcal | Difficulty: ${diffLabel}\n\nIngredients: ${ingredients.join(", ")}\n\nSteps:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
        `**${name}**\n${desc}\n\n⏱ Préparation: ${prepMin} min | 🔥 ${cal} kcal | Difficulté: ${diffLabel}\n\nIngrédients: ${ingredients.join(", ")}\n\nÉtapes:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
        lang,
      );
    }
  }

  // ── 2. Specific meal plan lookup ─────────────────────────────────────────
  for (const plan of SAMPLE_MEAL_PLANS) {
    const nameEn = plan.name_en.toLowerCase();
    const nameFr = plan.name_fr.toLowerCase();
    if (
      lower.includes(nameEn) ||
      lower.includes(nameFr) ||
      nameEn.split(" ").some((w) => w.length > 4 && lower.includes(w)) ||
      nameFr.split(" ").some((w) => w.length > 4 && lower.includes(w))
    ) {
      const name = lang === "fr" ? plan.name_fr : plan.name_en;
      const desc = lang === "fr" ? plan.description_fr : plan.description_en;
      const days = Number(plan.duration_days);
      const price = (Number(plan.price) / 100).toFixed(2);
      const dietKey = String(Object.keys(plan.diet_type)[0]);
      const dietLabel =
        lang === "fr"
          ? dietKey === "vegetarian"
            ? "Végétarien"
            : "Non-végétarien"
          : dietKey === "vegetarian"
            ? "Vegetarian"
            : "Non-vegetarian";
      const diffKey = String(Object.keys(plan.difficulty)[0]);
      const diffLabel =
        lang === "fr"
          ? ((
              { easy: "Facile", medium: "Moyen", hard: "Difficile" } as Record<
                string,
                string
              >
            )[diffKey] ?? "Moyen")
          : ((
              { easy: "Easy", medium: "Medium", hard: "Hard" } as Record<
                string,
                string
              >
            )[diffKey] ?? "Medium");

      return r(
        `**${name}**\n${desc}\n\nDuration: ${days} days | Difficulty: ${diffLabel} | Diet: ${dietLabel} | Price: €${price}/week\n\nThis plan includes ${plan.recipe_ids.length} featured recipes from our collection.`,
        `**${name}**\n${desc}\n\nDurée: ${days} jours | Difficulté: ${diffLabel} | Régime: ${dietLabel} | Prix: €${price}/semaine\n\nCe plan comprend ${plan.recipe_ids.length} recettes de notre collection.`,
        lang,
      );
    }
  }

  // ── 3. List all recipes ──────────────────────────────────────────────────
  if (
    (lower.includes("list") ||
      lower.includes("liste") ||
      lower.includes("all") ||
      lower.includes("toutes") ||
      lower.includes("tous") ||
      lower.includes("show") ||
      lower.includes("affiche")) &&
    (lower.includes("recipe") || lower.includes("recette"))
  ) {
    const names = SAMPLE_RECIPES.map((r) =>
      lang === "fr" ? `• ${r.name_fr}` : `• ${r.name_en}`,
    ).join("\n");
    return r(
      `Here are all our available recipes:\n${names}\n\nAsk me about any one of them for ingredients, steps, or nutrition info!`,
      `Voici toutes nos recettes disponibles:\n${names}\n\nDemandez-moi des détails sur l'une d'elles : ingrédients, étapes ou valeurs nutritionnelles !`,
      lang,
    );
  }

  // ── 4. List all plans ────────────────────────────────────────────────────
  if (
    (lower.includes("list") ||
      lower.includes("liste") ||
      lower.includes("all") ||
      lower.includes("toutes") ||
      lower.includes("tous") ||
      lower.includes("show") ||
      lower.includes("affiche")) &&
    lower.includes("plan")
  ) {
    const names = SAMPLE_MEAL_PLANS.map((p) =>
      lang === "fr" ? `• ${p.name_fr}` : `• ${p.name_en}`,
    ).join("\n");
    return r(
      `Here are all our meal plans:\n${names}\n\nAsk me about any one for full details!`,
      `Voici tous nos plans repas:\n${names}\n\nDemandez-moi les détails sur l'un d'eux !`,
      lang,
    );
  }

  // ── 5. Category-based recipe questions ──────────────────────────────────
  const categoryMap: Record<string, string[]> = {
    breakfast: ["breakfast", "petit-déjeuner", "matin", "morning"],
    lunch: ["lunch", "déjeuner", "midi"],
    dinner: ["dinner", "dîner", "soir", "evening"],
    snack: ["snack", "collation", "goûter"],
  };
  for (const [cat, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      const matches = SAMPLE_RECIPES.filter(
        (r) => String(Object.keys(r.category)[0]) === cat,
      );
      if (matches.length > 0) {
        const names = matches
          .map((r) => (lang === "fr" ? `• ${r.name_fr}` : `• ${r.name_en}`))
          .join("\n");
        const catLabel =
          lang === "fr"
            ? {
                breakfast: "petit-déjeuner",
                lunch: "déjeuner",
                dinner: "dîner",
                snack: "collation",
              }[cat]
            : cat;
        return r(
          `Here are our ${catLabel} recipes:\n${names}`,
          `Voici nos recettes pour le ${catLabel} :\n${names}`,
          lang,
        );
      }
    }
  }

  // ── 6. Vegetarian / non-vegetarian questions ─────────────────────────────
  if (
    lower.includes("vegetarian") ||
    lower.includes("végétarien") ||
    lower.includes("vegan")
  ) {
    const vegPlans = SAMPLE_MEAL_PLANS.filter(
      (p) => String(Object.keys(p.diet_type)[0]) === "vegetarian",
    );
    const vegRecipes = SAMPLE_RECIPES.filter(
      (r) => String(Object.keys(r.diet_type)[0]) === "vegetarian",
    );
    const planNames = vegPlans
      .map((p) => (lang === "fr" ? `• ${p.name_fr}` : `• ${p.name_en}`))
      .join("\n");
    const recipeNames = vegRecipes
      .map((r) => (lang === "fr" ? `• ${r.name_fr}` : `• ${r.name_en}`))
      .join("\n");
    return r(
      `We have ${vegPlans.length} vegetarian meal plans:\n${planNames}\n\nAnd ${vegRecipes.length} vegetarian recipes:\n${recipeNames}`,
      `Nous proposons ${vegPlans.length} plans végétariens:\n${planNames}\n\nEt ${vegRecipes.length} recettes végétariennes:\n${recipeNames}`,
      lang,
    );
  }

  // ── 7. General nutrition topics ──────────────────────────────────────────
  if (lower.includes("calorie") || lower.includes("calori")) {
    return r(
      "Calorie needs vary by person based on age, activity level, and goals. Our recipes range from 180 to 450 kcal per serving. Ask me about a specific recipe for exact nutrition info!",
      "Les besoins en calories varient selon l'âge, l'activité et les objectifs. Nos recettes vont de 180 à 450 kcal par portion. Demandez-moi une recette précise pour les valeurs exactes !",
      lang,
    );
  }

  if (
    lower.includes("protein") ||
    lower.includes("protéine") ||
    lower.includes("proteines")
  ) {
    return r(
      "Protein is essential for muscle repair and satiety. Our non-vegetarian recipes are especially rich in protein (up to 42g per serving). Try the Herb-Roasted Chicken or the Revisited Salade Niçoise!",
      "Les protéines sont essentielles pour la réparation musculaire et la satiété. Nos recettes non-végétariennes sont particulièrement riches (jusqu'à 42g par portion). Essayez le Poulet Rôti aux Herbes ou la Salade Niçoise Revisitée !",
      lang,
    );
  }

  if (
    lower.includes("hydrat") ||
    lower.includes("water") ||
    lower.includes("eau")
  ) {
    return r(
      "Staying hydrated is key to good health. Aim for at least 1.5–2 liters of water per day, and more if you're active. Soups like our French Onion Soup also contribute to hydration!",
      "Rester hydraté est essentiel pour la santé. Visez au moins 1,5 à 2 litres d'eau par jour, davantage si vous êtes actif. Des soupes comme notre Soupe à l'Oignon contribuent aussi à l'hydratation !",
      lang,
    );
  }

  if (
    lower.includes("bmi") ||
    lower.includes("imc") ||
    lower.includes("weight") ||
    lower.includes("poids") ||
    lower.includes("taille")
  ) {
    return r(
      "Use the Personalized Plan section on our website to enter your height and weight. We'll calculate your BMI and recommend the best meal plan for your profile!",
      "Utilisez la section Plan Personnalisé sur notre site pour entrer votre taille et votre poids. Nous calculerons votre IMC et recommanderons le meilleur plan repas pour votre profil !",
      lang,
    );
  }

  if (
    lower.includes("french") ||
    lower.includes("français") ||
    lower.includes("cuisine")
  ) {
    return r(
      "Healthy French cuisine is all about balance: fresh seasonal vegetables, quality proteins, moderate portions, and aromatic herbs. Our recipes are reinvented classics that keep all the flavor while being nutritionally balanced.",
      "La cuisine française saine repose sur l'équilibre : légumes de saison frais, protéines de qualité, portions modérées et herbes aromatiques. Nos recettes sont des classiques revisités qui gardent toute la saveur tout en étant nutritionnellement équilibrés.",
      lang,
    );
  }

  if (
    lower.includes("price") ||
    lower.includes("prix") ||
    lower.includes("cost") ||
    lower.includes("coût") ||
    lower.includes("cher")
  ) {
    const planList = SAMPLE_MEAL_PLANS.map((p) => {
      const name = lang === "fr" ? p.name_fr : p.name_en;
      const price = (Number(p.price) / 100).toFixed(2);
      return lang === "fr"
        ? `• ${name}: €${price}/semaine`
        : `• ${name}: €${price}/week`;
    }).join("\n");
    return r(
      `Here are our meal plan prices:\n${planList}`,
      `Voici les prix de nos plans repas:\n${planList}`,
      lang,
    );
  }

  if (lower.includes("how many") || lower.includes("combien")) {
    if (lower.includes("plan")) {
      return r(
        `We currently offer ${SAMPLE_MEAL_PLANS.length} meal plans. Type "list plans" to see them all!`,
        `Nous proposons actuellement ${SAMPLE_MEAL_PLANS.length} plans repas. Tapez "liste des plans" pour les voir tous !`,
        lang,
      );
    }
    if (lower.includes("recipe") || lower.includes("recette")) {
      return r(
        `We currently have ${SAMPLE_RECIPES.length} recipes. Type "list recipes" to see them all!`,
        `Nous avons actuellement ${SAMPLE_RECIPES.length} recettes. Tapez "liste des recettes" pour les voir toutes !`,
        lang,
      );
    }
  }

  if (
    lower.includes("hello") ||
    lower.includes("hi ") ||
    lower === "hi" ||
    lower.includes("bonjour") ||
    lower.includes("salut")
  ) {
    return r(
      "Hello! I'm Saveur BOT, your nutrition assistant. I can help you with:\n• Recipe details (ingredients, steps, nutrition)\n• Meal plan information\n• Nutrition and diet advice\n\nWhat would you like to know?",
      "Bonjour ! Je suis Saveur BOT, votre assistant nutrition. Je peux vous aider avec :\n• Les détails des recettes (ingrédients, étapes, nutrition)\n• Les informations sur les plans repas\n• Des conseils nutrition et régime\n\nQue souhaitez-vous savoir ?",
      lang,
    );
  }

  if (
    lower.includes("help") ||
    lower.includes("aide") ||
    lower.includes("what can") ||
    lower.includes("que peux")
  ) {
    return r(
      `I can answer questions about:\n• Any of our ${SAMPLE_RECIPES.length} recipes (e.g. "Tell me about the Ratatouille")\n• Our ${SAMPLE_MEAL_PLANS.length} meal plans (e.g. "What is the Vegetarian Balance plan?")\n• Nutrition topics (calories, protein, hydration, BMI)\n• Vegetarian options\n\nJust ask!`,
      `Je peux répondre aux questions sur :\n• Nos ${SAMPLE_RECIPES.length} recettes (ex: "Parle-moi de la Ratatouille")\n• Nos ${SAMPLE_MEAL_PLANS.length} plans repas (ex: "C'est quoi le plan Équilibre Végétarien ?")\n• La nutrition (calories, protéines, hydratation, IMC)\n• Les options végétariennes\n\nPostez votre question !`,
      lang,
    );
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return r(
    `I didn't quite catch that. I can help with recipes, meal plans, and nutrition advice. Try asking things like:\n• "What are the ingredients in the Ratatouille?"\n• "Tell me about the French Vitality plan"\n• "List all vegetarian recipes"`,
    `Je n'ai pas bien compris. Je peux vous aider avec les recettes, les plans repas et les conseils nutrition. Essayez par exemple :\n• "Quels sont les ingrédients de la Ratatouille ?"\n• "Parle-moi du plan Vitalité Française"\n• "Liste toutes les recettes végétariennes"`,
    lang,
  );
}
