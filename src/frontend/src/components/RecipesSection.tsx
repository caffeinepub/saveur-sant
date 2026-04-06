import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useState } from "react";
import type { Recipe } from "../backend";
import { useLanguage } from "../contexts/LanguageContext";
import { SAMPLE_RECIPES } from "../data/sampleData";
import { useAllRecipes } from "../hooks/useQueries";
import RecipeCard from "./RecipeCard";
import RecipeModal from "./RecipeModal";

export default function RecipesSection() {
  const { t } = useLanguage();
  const { data: recipes, isLoading } = useAllRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<
    (Recipe & { id: number }) | null
  >(null);

  const displayRecipes =
    recipes && recipes.length > 0
      ? recipes.map((r, i) => ({ ...r, id: i + 1 }))
      : SAMPLE_RECIPES;

  return (
    <section id="recipes" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-[oklch(0.145_0_0)] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("recipes.title")}
          </h2>
          <p className="text-[oklch(0.56_0.016_65)] max-w-xl mx-auto text-sm leading-relaxed font-sans">
            {t("recipes.subtitle")}
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="recipes.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-card"
              >
                <Skeleton className="h-52 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayRecipes.length === 0 ? (
          <div
            className="text-center py-16 text-[oklch(0.56_0.016_65)] font-sans"
            data-ocid="recipes.empty_state"
          >
            {t("recipes.empty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRecipes.slice(0, 6).map((recipe, i) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={i}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        )}
      </div>

      <RecipeModal
        recipe={selectedRecipe}
        open={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </section>
  );
}
