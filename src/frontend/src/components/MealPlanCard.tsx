import { BarChart2, Clock } from "lucide-react";
import { motion } from "motion/react";
import type { MealPlan } from "../backend";
import {
  Variant_easy_hard_medium,
  Variant_non_vegetarian_vegetarian,
} from "../backend";
import { useLanguage } from "../contexts/LanguageContext";
import { FOOD_IMAGES } from "../data/sampleData";

interface Props {
  plan: MealPlan & { id: number };
  index: number;
  onClick: () => void;
}

export default function MealPlanCard({ plan, index, onClick }: Props) {
  const { t, language } = useLanguage();

  const name = language === "fr" ? plan.name_fr : plan.name_en;
  const description =
    language === "fr" ? plan.description_fr : plan.description_en;
  const imageUrl = FOOD_IMAGES[index % FOOD_IMAGES.length];
  const price = Number(plan.price) / 100;
  const isVeg = plan.diet_type === Variant_non_vegetarian_vegetarian.vegetarian;

  const difficultyLabel =
    plan.difficulty === Variant_easy_hard_medium.easy
      ? t("plans.card.difficulty.easy")
      : plan.difficulty === Variant_easy_hard_medium.medium
        ? t("plans.card.difficulty.medium")
        : t("plans.card.difficulty.hard");

  const dietLabel = isVeg
    ? t("plans.card.diet.vegetarian")
    : t("plans.card.diet.non_vegetarian");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col group cursor-pointer"
      onClick={onClick}
      data-ocid={`plans.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Diet badge */}
        <span
          className="absolute top-3 left-3 text-xs font-semibold tracking-widest px-2.5 py-1 rounded-full font-sans"
          style={{
            backgroundColor: isVeg
              ? "rgba(31,74,58,0.15)"
              : "rgba(181,156,90,0.18)",
            color: isVeg ? "oklch(0.36 0.082 163)" : "oklch(0.55 0.08 75)",
          }}
        >
          {dietLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-lg font-bold mb-2 text-[oklch(0.145_0_0)] leading-snug"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {name}
        </h3>
        <p className="text-sm text-[oklch(0.56_0.016_65)] leading-relaxed mb-4 flex-1 font-sans line-clamp-2">
          {description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-[oklch(0.56_0.016_65)] font-sans">
            <Clock className="w-3.5 h-3.5" />
            {Number(plan.duration_days)} {t("plans.card.days")}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[oklch(0.56_0.016_65)] font-sans">
            <BarChart2 className="w-3.5 h-3.5" />
            {difficultyLabel}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-2xl font-bold font-sans"
            style={{ color: "oklch(0.36 0.082 163)" }}
          >
            {price.toFixed(2)}€
          </span>
          <span className="text-xs text-[oklch(0.56_0.016_65)] font-sans">
            {t("plans.card.per_week")}
          </span>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 font-sans"
          style={{ backgroundColor: "oklch(0.36 0.082 163)" }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          data-ocid={`plans.item.${index + 1}`}
        >
          {t("plans.card.cta")}
        </button>
      </div>
    </motion.div>
  );
}
