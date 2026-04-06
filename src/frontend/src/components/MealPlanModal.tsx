import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChefHat, Clock, Leaf, Users } from "lucide-react";
import type { MealPlan } from "../backend";
import {
  Variant_easy_hard_medium,
  Variant_non_vegetarian_vegetarian,
} from "../backend";
import { useLanguage } from "../contexts/LanguageContext";
import { FOOD_IMAGES } from "../data/sampleData";

interface Props {
  plan: (MealPlan & { id: number }) | null;
  open: boolean;
  onClose: () => void;
}

export default function MealPlanModal({ plan, open, onClose }: Props) {
  const { t, language } = useLanguage();

  if (!plan) return null;

  const name = language === "fr" ? plan.name_fr : plan.name_en;
  const description =
    language === "fr" ? plan.description_fr : plan.description_en;
  const isVeg = plan.diet_type === Variant_non_vegetarian_vegetarian.vegetarian;
  const price = Number(plan.price) / 100;
  const imageUrl = FOOD_IMAGES[plan.id % FOOD_IMAGES.length];

  const difficultyLabel =
    plan.difficulty === Variant_easy_hard_medium.easy
      ? t("plans.card.difficulty.easy")
      : plan.difficulty === Variant_easy_hard_medium.medium
        ? t("plans.card.difficulty.medium")
        : t("plans.card.difficulty.hard");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden"
        data-ocid="plans.modal"
      >
        {/* Header Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
            }}
          />
          <div className="absolute bottom-4 left-6">
            <span
              className="text-xs font-semibold tracking-widest px-3 py-1 rounded-full mb-2 inline-block font-sans"
              style={{
                backgroundColor: isVeg
                  ? "rgba(31,74,58,0.85)"
                  : "rgba(181,156,90,0.85)",
                color: "white",
              }}
            >
              {isVeg
                ? t("plans.card.diet.vegetarian")
                : t("plans.card.diet.non_vegetarian")}
            </span>
          </div>
        </div>

        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle
              className="text-2xl font-bold text-[oklch(0.145_0_0)]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {name}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-[oklch(0.56_0.016_65)] leading-relaxed mb-6 font-sans">
            {description}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-[oklch(0.944_0.022_85)] rounded-lg p-3 text-center">
              <Clock
                className="w-4 h-4 mx-auto mb-1"
                style={{ color: "oklch(0.36 0.082 163)" }}
              />
              <div className="text-lg font-bold text-[oklch(0.145_0_0)] font-sans">
                {Number(plan.duration_days)}
              </div>
              <div className="text-xs text-[oklch(0.56_0.016_65)] font-sans">
                {t("plan.modal.days")}
              </div>
            </div>
            <div className="bg-[oklch(0.944_0.022_85)] rounded-lg p-3 text-center">
              <ChefHat
                className="w-4 h-4 mx-auto mb-1"
                style={{ color: "oklch(0.36 0.082 163)" }}
              />
              <div className="text-sm font-bold text-[oklch(0.145_0_0)] font-sans">
                {difficultyLabel}
              </div>
              <div className="text-xs text-[oklch(0.56_0.016_65)] font-sans">
                {t("plan.modal.difficulty")}
              </div>
            </div>
            <div className="bg-[oklch(0.944_0.022_85)] rounded-lg p-3 text-center">
              <Leaf
                className="w-4 h-4 mx-auto mb-1"
                style={{ color: "oklch(0.36 0.082 163)" }}
              />
              <div className="text-sm font-bold text-[oklch(0.145_0_0)] font-sans">
                {isVeg ? "Veg" : "Omni"}
              </div>
              <div className="text-xs text-[oklch(0.56_0.016_65)] font-sans">
                {t("plan.modal.diet")}
              </div>
            </div>
            <div className="bg-[oklch(0.944_0.022_85)] rounded-lg p-3 text-center">
              <Users
                className="w-4 h-4 mx-auto mb-1"
                style={{ color: "oklch(0.36 0.082 163)" }}
              />
              <div className="text-sm font-bold text-[oklch(0.145_0_0)] font-sans">
                {plan.recipe_ids.length}
              </div>
              <div className="text-xs text-[oklch(0.56_0.016_65)] font-sans">
                {t("plan.modal.recipes_count")}
              </div>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-[oklch(0.9_0.02_80)]">
            <div>
              <span
                className="text-3xl font-bold font-sans"
                style={{ color: "oklch(0.36 0.082 163)" }}
              >
                {price.toFixed(2)}€
              </span>
              <span className="text-sm text-[oklch(0.56_0.016_65)] ml-1 font-sans">
                {t("plan.modal.per_week")}
              </span>
            </div>
            <button
              type="button"
              className="px-8 py-3 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 font-sans"
              style={{ backgroundColor: "oklch(0.36 0.082 163)" }}
              onClick={onClose}
              data-ocid="plans.confirm_button"
            >
              {t("plan.modal.cta")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
