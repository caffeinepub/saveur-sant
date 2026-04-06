import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChefHat, Clock, Leaf } from "lucide-react";
import type { Recipe } from "../backend";
import {
  Variant_easy_hard_medium,
  Variant_non_vegetarian_vegetarian,
} from "../backend";
import { useLanguage } from "../contexts/LanguageContext";
import { FOOD_IMAGES } from "../data/sampleData";

interface Props {
  recipe: (Recipe & { id: number }) | null;
  open: boolean;
  onClose: () => void;
}

export default function RecipeModal({ recipe, open, onClose }: Props) {
  const { t, language } = useLanguage();

  if (!recipe) return null;

  const name = language === "fr" ? recipe.name_fr : recipe.name_en;
  const description =
    language === "fr" ? recipe.description_fr : recipe.description_en;
  const ingredients =
    language === "fr" ? recipe.ingredients_fr : recipe.ingredients_en;
  const steps = language === "fr" ? recipe.steps_fr : recipe.steps_en;
  const imageUrl =
    recipe.image_url || FOOD_IMAGES[recipe.id % FOOD_IMAGES.length];

  const isVeg =
    recipe.diet_type === Variant_non_vegetarian_vegetarian.vegetarian;
  const difficultyLabel =
    recipe.difficulty === Variant_easy_hard_medium.easy
      ? t("plans.card.difficulty.easy")
      : recipe.difficulty === Variant_easy_hard_medium.medium
        ? t("plans.card.difficulty.medium")
        : t("plans.card.difficulty.hard");

  const categoryLabel = (() => {
    const cat = recipe.category as string;
    if (cat === "breakfast") return t("recipes.category.breakfast");
    if (cat === "lunch") return t("recipes.category.lunch");
    if (cat === "dinner") return t("recipes.category.dinner");
    return t("recipes.category.snack");
  })();

  const nutritionItems = [
    {
      label: t("recipe.modal.calories"),
      value: `${Number(recipe.nutrition.calories)} kcal`,
    },
    {
      label: t("recipe.modal.protein"),
      value: `${Number(recipe.nutrition.protein)}g`,
    },
    {
      label: t("recipe.modal.carbs"),
      value: `${Number(recipe.nutrition.carbs)}g`,
    },
    {
      label: t("recipe.modal.fat"),
      value: `${Number(recipe.nutrition.fat)}g`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden"
        data-ocid="recipes.modal"
      >
        {/* Header Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
            }}
          />
        </div>

        <ScrollArea className="max-h-[65vh]">
          <div className="p-6">
            <DialogHeader className="mb-3">
              <DialogTitle
                className="text-2xl font-bold text-[oklch(0.145_0_0)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {name}
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-[oklch(0.56_0.016_65)] leading-relaxed mb-5 font-sans">
              {description}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[oklch(0.944_0.022_85)] text-[oklch(0.36_0.082_163)] font-sans">
                <Clock className="w-3.5 h-3.5" />
                {Number(recipe.prep_time_min)} min
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[oklch(0.944_0.022_85)] text-[oklch(0.36_0.082_163)] font-sans">
                <ChefHat className="w-3.5 h-3.5" />
                {difficultyLabel}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[oklch(0.944_0.022_85)] text-[oklch(0.36_0.082_163)] font-sans">
                {categoryLabel}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[oklch(0.944_0.022_85)] text-[oklch(0.36_0.082_163)] font-sans">
                <Leaf className="w-3.5 h-3.5" />
                {isVeg
                  ? t("plans.card.diet.vegetarian")
                  : t("plans.card.diet.non_vegetarian")}
              </span>
            </div>

            {/* Nutrition */}
            <div className="mb-6">
              <h4
                className="text-base font-bold text-[oklch(0.145_0_0)] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("recipe.modal.nutrition")}
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {nutritionItems.map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-[oklch(0.944_0.022_85)] rounded-lg p-3 text-center"
                  >
                    <div className="text-sm font-bold text-[oklch(0.36_0.082_163)] font-sans">
                      {value}
                    </div>
                    <div className="text-xs text-[oklch(0.56_0.016_65)] font-sans mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <h4
                className="text-base font-bold text-[oklch(0.145_0_0)] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("recipe.modal.ingredients")}
              </h4>
              <ul className="space-y-2">
                {ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="flex items-start gap-2 text-sm text-[oklch(0.35_0.01_60)] font-sans"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: "oklch(0.72 0.09 75)" }}
                    />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <h4
                className="text-base font-bold text-[oklch(0.145_0_0)] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("recipe.modal.steps")}
              </h4>
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: steps are ordered and stable
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5 font-sans"
                      style={{ backgroundColor: "oklch(0.36 0.082 163)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-[oklch(0.35_0.01_60)] leading-relaxed font-sans">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
