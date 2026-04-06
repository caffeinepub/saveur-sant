import { HeartPulse, Users, Utensils } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();

  const cards = [
    {
      icon: Utensils,
      title: t("about.card1.title"),
      desc: t("about.card1.desc"),
    },
    {
      icon: HeartPulse,
      title: t("about.card2.title"),
      desc: t("about.card2.desc"),
    },
    {
      icon: Users,
      title: t("about.card3.title"),
      desc: t("about.card3.desc"),
    },
  ];

  return (
    <section
      id="about"
      className="py-20"
      style={{ backgroundColor: "oklch(0.944 0.022 85)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
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
            {t("about.title")}
          </h2>
          <p className="text-[oklch(0.56_0.016_65)] max-w-xl mx-auto text-sm leading-relaxed font-sans">
            {t("about.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-white rounded-xl p-8 shadow-card text-center"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "oklch(0.36 0.082 163 / 0.12)" }}
              >
                <card.icon
                  className="w-7 h-7"
                  style={{ color: "oklch(0.36 0.082 163)" }}
                />
              </div>
              <h3
                className="text-lg font-bold text-[oklch(0.145_0_0)] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {card.title}
              </h3>
              <p className="text-sm text-[oklch(0.56_0.016_65)] leading-relaxed font-sans">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
