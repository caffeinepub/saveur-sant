import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative w-full min-h-[85vh] flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/assets/generated/hero-saveur-sante.dim_1600x900.jpg')`,
        }}
      />
      {/* Gradient Overlay: dark on left, fades right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("hero.headline1")}
            <br />
            <span style={{ color: "oklch(0.85 0.09 75)" }}>
              {t("hero.headline2")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="text-lg text-white/80 mb-10 font-sans leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#meal-plans"
              className="inline-flex items-center px-7 py-3 rounded-lg text-white font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-90 hover:shadow-lg font-sans"
              style={{ backgroundColor: "oklch(0.72 0.09 75)" }}
              data-ocid="hero.primary_button"
            >
              {t("hero.cta.primary")}
            </a>
            <a
              href="#recipes"
              className="inline-flex items-center px-7 py-3 rounded-lg text-white font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-90 hover:shadow-lg font-sans"
              style={{ backgroundColor: "oklch(0.2 0 0)" }}
              data-ocid="hero.secondary_button"
            >
              {t("hero.cta.secondary")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
