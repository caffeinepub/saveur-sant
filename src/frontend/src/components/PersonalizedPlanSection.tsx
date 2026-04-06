import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { SAMPLE_MEAL_PLANS } from "../data/sampleData";

type UnitSystem = "metric" | "imperial";

type BMICategory = "underweight" | "normal" | "overweight" | "obese";

interface BMIResult {
  value: number;
  category: BMICategory;
  recommendedPlanId: number;
}

function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

function getRecommendedPlanId(category: BMICategory): number {
  switch (category) {
    case "underweight":
      return 4;
    case "normal":
      return 2;
    case "overweight":
      return 3;
    case "obese":
      return 1;
  }
}

const BMI_CATEGORY_COLORS: Record<BMICategory, string> = {
  underweight: "oklch(0.72 0.09 75)",
  normal: "oklch(0.36 0.082 163)",
  overweight: "oklch(0.7 0.15 60)",
  obese: "oklch(0.577 0.245 27.325)",
};

export default function PersonalizedPlanSection() {
  const { t, language } = useLanguage();

  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>(
    {},
  );

  function validate(): boolean {
    const newErrors: { height?: string; weight?: string } = {};
    if (unit === "metric") {
      const h = Number.parseFloat(heightCm);
      if (!heightCm || Number.isNaN(h) || h <= 0 || h > 300) {
        newErrors.height =
          language === "fr"
            ? "Veuillez saisir une taille valide (cm)"
            : "Please enter a valid height (cm)";
      }
    } else {
      const ft = Number.parseFloat(heightFt);
      const inches = Number.parseFloat(heightIn || "0");
      if (!heightFt || Number.isNaN(ft) || ft <= 0 || ft > 8) {
        newErrors.height =
          language === "fr"
            ? "Veuillez saisir une taille valide (pieds)"
            : "Please enter a valid height (feet)";
      } else if (Number.isNaN(inches) || inches < 0 || inches >= 12) {
        newErrors.height =
          language === "fr"
            ? "Les pouces doivent être entre 0 et 11"
            : "Inches must be between 0 and 11";
      }
    }
    const w = Number.parseFloat(weight);
    if (!weight || Number.isNaN(w) || w <= 0 || w > 500) {
      newErrors.weight =
        language === "fr"
          ? "Veuillez saisir un poids valide"
          : "Please enter a valid weight";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    let heightM: number;
    let weightKg: number;

    if (unit === "metric") {
      heightM = Number.parseFloat(heightCm) / 100;
      weightKg = Number.parseFloat(weight);
    } else {
      const totalInches =
        Number.parseFloat(heightFt) * 12 + Number.parseFloat(heightIn || "0");
      heightM = totalInches * 0.0254;
      weightKg = Number.parseFloat(weight) * 0.453592;
    }

    const bmi = weightKg / (heightM * heightM);
    const category = getBMICategory(bmi);
    const recommendedPlanId = getRecommendedPlanId(category);

    setResult({
      value: Math.round(bmi * 10) / 10,
      category,
      recommendedPlanId,
    });
  }

  function handleUnitSwitch(newUnit: UnitSystem) {
    setUnit(newUnit);
    setResult(null);
    setErrors({});
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setWeight("");
  }

  const recommendedPlan = result
    ? SAMPLE_MEAL_PLANS.find((p) => p.id === result.recommendedPlanId)
    : null;

  const planName = recommendedPlan
    ? language === "fr"
      ? recommendedPlan.name_fr
      : recommendedPlan.name_en
    : "";

  const planDesc = recommendedPlan
    ? language === "fr"
      ? recommendedPlan.description_fr
      : recommendedPlan.description_en
    : "";

  const categoryKey = result ? `personal.bmi.${result.category}` : "";
  const categoryColor = result ? BMI_CATEGORY_COLORS[result.category] : "";

  return (
    <section
      id="personalized-plan"
      className="py-20"
      style={{ backgroundColor: "oklch(1 0 0)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "oklch(0.145 0 0)",
            }}
          >
            {t("personal.title")}
          </h2>
          <p
            className="max-w-xl mx-auto text-sm leading-relaxed font-sans"
            style={{ color: "oklch(0.56 0.016 65)" }}
          >
            {t("personal.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Card
            className="border shadow-sm"
            style={{
              borderColor: "oklch(0.9 0.02 80)",
              backgroundColor: "oklch(0.978 0.01 80)",
            }}
          >
            <CardContent className="p-6 sm:p-8">
              {/* Unit Toggle */}
              <div className="mb-6">
                <fieldset className="border-0 p-0 m-0">
                  <legend className="sr-only">
                    {language === "fr" ? "Système d'unités" : "Unit system"}
                  </legend>
                  <div
                    className="inline-flex rounded-lg p-1"
                    style={{ backgroundColor: "oklch(0.93 0.018 82)" }}
                  >
                    {(["metric", "imperial"] as UnitSystem[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => handleUnitSwitch(u)}
                        className="px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 font-sans"
                        data-ocid={`personal.${u}.toggle`}
                        aria-pressed={unit === u}
                        style={{
                          backgroundColor:
                            unit === u
                              ? "oklch(0.36 0.082 163)"
                              : "transparent",
                          color:
                            unit === u
                              ? "oklch(1 0 0)"
                              : "oklch(0.56 0.016 65)",
                          fontWeight: unit === u ? 600 : 400,
                        }}
                      >
                        {t(`personal.unit.${u}`)}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Form */}
              <form onSubmit={handleCalculate} noValidate>
                <div className="grid gap-5">
                  {/* Height */}
                  <div>
                    <Label
                      className="text-sm font-semibold mb-2 block font-sans"
                      style={{ color: "oklch(0.32 0.06 163)" }}
                    >
                      {t("personal.height")}
                    </Label>

                    {unit === "metric" ? (
                      <div>
                        <Input
                          id="height-cm"
                          type="number"
                          min="50"
                          max="300"
                          placeholder={t("personal.height.cm")}
                          value={heightCm}
                          onChange={(e) => {
                            setHeightCm(e.target.value);
                            setErrors((prev) => ({
                              ...prev,
                              height: undefined,
                            }));
                          }}
                          className="font-sans text-sm"
                          style={{
                            borderColor: errors.height
                              ? "oklch(0.577 0.245 27)"
                              : "oklch(0.9 0.02 80)",
                          }}
                          data-ocid="personal.height.input"
                          aria-describedby={
                            errors.height ? "height-error" : undefined
                          }
                        />
                        {errors.height && (
                          <p
                            id="height-error"
                            className="mt-1 text-xs font-sans"
                            style={{ color: "oklch(0.577 0.245 27)" }}
                            data-ocid="personal.height.error_state"
                          >
                            {errors.height}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Input
                            id="height-ft"
                            type="number"
                            min="1"
                            max="8"
                            placeholder={t("personal.height.ft")}
                            value={heightFt}
                            onChange={(e) => {
                              setHeightFt(e.target.value);
                              setErrors((prev) => ({
                                ...prev,
                                height: undefined,
                              }));
                            }}
                            className="font-sans text-sm"
                            style={{
                              borderColor: errors.height
                                ? "oklch(0.577 0.245 27)"
                                : "oklch(0.9 0.02 80)",
                            }}
                            data-ocid="personal.height.ft.input"
                          />
                        </div>
                        <div>
                          <Input
                            id="height-in"
                            type="number"
                            min="0"
                            max="11"
                            placeholder={t("personal.height.in")}
                            value={heightIn}
                            onChange={(e) => {
                              setHeightIn(e.target.value);
                              setErrors((prev) => ({
                                ...prev,
                                height: undefined,
                              }));
                            }}
                            className="font-sans text-sm"
                            style={{
                              borderColor: errors.height
                                ? "oklch(0.577 0.245 27)"
                                : "oklch(0.9 0.02 80)",
                            }}
                            data-ocid="personal.height.in.input"
                          />
                        </div>
                        {errors.height && (
                          <p
                            className="col-span-2 mt-1 text-xs font-sans"
                            style={{ color: "oklch(0.577 0.245 27)" }}
                            data-ocid="personal.height.error_state"
                          >
                            {errors.height}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Weight */}
                  <div>
                    <Label
                      className="text-sm font-semibold mb-2 block font-sans"
                      style={{ color: "oklch(0.32 0.06 163)" }}
                    >
                      {t("personal.weight")}
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      min="20"
                      max="500"
                      placeholder={
                        unit === "metric"
                          ? t("personal.weight.kg")
                          : t("personal.weight.lbs")
                      }
                      value={weight}
                      onChange={(e) => {
                        setWeight(e.target.value);
                        setErrors((prev) => ({ ...prev, weight: undefined }));
                      }}
                      className="font-sans text-sm"
                      style={{
                        borderColor: errors.weight
                          ? "oklch(0.577 0.245 27)"
                          : "oklch(0.9 0.02 80)",
                      }}
                      data-ocid="personal.weight.input"
                      aria-describedby={
                        errors.weight ? "weight-error" : undefined
                      }
                    />
                    {errors.weight && (
                      <p
                        id="weight-error"
                        className="mt-1 text-xs font-sans"
                        style={{ color: "oklch(0.577 0.245 27)" }}
                        data-ocid="personal.weight.error_state"
                      >
                        {errors.weight}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full font-sans font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-90"
                    style={{
                      backgroundColor: "oklch(0.36 0.082 163)",
                      color: "oklch(1 0 0)",
                    }}
                    data-ocid="personal.submit_button"
                  >
                    {t("personal.calculate")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* BMI Result + Recommendation */}
          <AnimatePresence>
            {result && (
              <motion.div
                key="bmi-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45 }}
                className="mt-6 space-y-4"
              >
                {/* BMI Card */}
                <Card
                  className="border overflow-hidden"
                  style={{ borderColor: "oklch(0.9 0.02 80)" }}
                  data-ocid="personal.bmi.card"
                >
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: categoryColor }}
                  />
                  <CardContent className="p-5 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-widest mb-1 font-sans"
                        style={{ color: "oklch(0.56 0.016 65)" }}
                      >
                        {t("personal.bmi.result")}
                      </p>
                      <p
                        className="text-4xl font-bold"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: categoryColor,
                        }}
                      >
                        {result.value}
                      </p>
                    </div>
                    <Badge
                      className="text-sm px-4 py-1.5 font-semibold font-sans rounded-full"
                      style={{
                        backgroundColor: `${categoryColor}22`,
                        color: categoryColor,
                        border: `1.5px solid ${categoryColor}55`,
                      }}
                    >
                      {t(categoryKey)}
                    </Badge>
                  </CardContent>
                </Card>

                {/* Recommendation Card */}
                {recommendedPlan && (
                  <Card
                    className="border"
                    style={{
                      borderColor: "oklch(0.9 0.02 80)",
                      backgroundColor: "oklch(0.978 0.01 80)",
                    }}
                    data-ocid="personal.recommendation.card"
                  >
                    <CardContent className="p-5">
                      <p
                        className="text-xs font-semibold uppercase tracking-widest mb-3 font-sans"
                        style={{ color: "oklch(0.56 0.016 65)" }}
                      >
                        {t("personal.recommendation")}
                      </p>
                      <p
                        className="text-sm mb-2 font-sans"
                        style={{ color: "oklch(0.56 0.016 65)" }}
                      >
                        {t("personal.recommendation.desc")}
                      </p>

                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-lg font-bold mb-1"
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              color: "oklch(0.145 0 0)",
                            }}
                          >
                            {planName}
                          </h3>
                          <p
                            className="text-sm leading-relaxed font-sans"
                            style={{ color: "oklch(0.56 0.016 65)" }}
                          >
                            {planDesc}
                          </p>
                        </div>

                        <Button
                          asChild
                          className="shrink-0 font-sans font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-90"
                          style={{
                            backgroundColor: "oklch(0.36 0.082 163)",
                            color: "oklch(1 0 0)",
                          }}
                          data-ocid="personal.view.plan.button"
                        >
                          <a href="#meal-plans">{t("personal.view.plan")}</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
