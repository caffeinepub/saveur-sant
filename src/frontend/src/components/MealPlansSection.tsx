import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useState } from "react";
import type { MealPlan } from "../backend";
import { Variant_non_vegetarian_vegetarian } from "../backend";
import { useLanguage } from "../contexts/LanguageContext";
import { SAMPLE_MEAL_PLANS } from "../data/sampleData";
import { useAllMealPlans } from "../hooks/useQueries";
import MealPlanCard from "./MealPlanCard";
import MealPlanModal from "./MealPlanModal";

type Filter = "all" | "vegetarian" | "non_vegetarian";

export default function MealPlansSection() {
  const { t } = useLanguage();
  const { data: plans, isLoading } = useAllMealPlans();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedPlan, setSelectedPlan] = useState<
    (MealPlan & { id: number }) | null
  >(null);

  const displayPlans =
    plans && plans.length > 0
      ? plans.map((p, i) => ({ ...p, id: i + 1 }))
      : SAMPLE_MEAL_PLANS;

  const filtered =
    filter === "all"
      ? displayPlans
      : displayPlans.filter((p) =>
          filter === "vegetarian"
            ? p.diet_type === Variant_non_vegetarian_vegetarian.vegetarian
            : p.diet_type === Variant_non_vegetarian_vegetarian.non_vegetarian,
        );

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t("plans.filter.all") },
    { key: "vegetarian", label: t("plans.filter.vegetarian") },
    { key: "non_vegetarian", label: t("plans.filter.non_vegetarian") },
  ];

  return (
    <section
      id="meal-plans"
      className="py-20"
      style={{ backgroundColor: "oklch(0.944 0.022 85)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-[oklch(0.145_0_0)] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("plans.title")}
          </h2>
          <p className="text-[oklch(0.56_0.016_65)] max-w-xl mx-auto text-sm leading-relaxed font-sans">
            {t("plans.subtitle")}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div
          className="flex justify-center gap-2 mb-10"
          data-ocid="plans.tab"
          role="tablist"
        >
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 font-sans"
              style={{
                backgroundColor:
                  filter === f.key ? "oklch(0.36 0.082 163)" : "white",
                color: filter === f.key ? "white" : "oklch(0.56 0.016 65)",
                border: `1.5px solid ${
                  filter === f.key
                    ? "oklch(0.36 0.082 163)"
                    : "oklch(0.9 0.02 80)"
                }`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-ocid="plans.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-card"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-16 text-[oklch(0.56_0.016_65)] font-sans"
            data-ocid="plans.empty_state"
          >
            {t("plans.empty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((plan, i) => (
              <MealPlanCard
                key={plan.id}
                plan={plan}
                index={i}
                onClick={() => setSelectedPlan(plan)}
              />
            ))}
          </div>
        )}
      </div>

      <MealPlanModal
        plan={selectedPlan}
        open={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </section>
  );
}
