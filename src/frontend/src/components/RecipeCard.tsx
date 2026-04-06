import { Clock, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Recipe } from "../backend";
import { useLanguage } from "../contexts/LanguageContext";
import { FOOD_IMAGES } from "../data/sampleData";

interface Props {
  recipe: Recipe & { id: number };
  index: number;
  onClick: () => void;
}

export default function RecipeCard({ recipe, index, onClick }: Props) {
  const { language } = useLanguage();

  const name = language === "fr" ? recipe.name_fr : recipe.name_en;
  const imageUrl = recipe.image_url || FOOD_IMAGES[index % FOOD_IMAGES.length];
  const rating = 4 + (index % 2) * 0.5; // 4.0 or 4.5 stars

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 group cursor-pointer"
      onClick={onClick}
      data-ocid={`recipes.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating + Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-3.5 h-3.5"
                style={{
                  color: star <= Math.floor(rating) ? "#C9A24A" : "#E2D3B0",
                  fill: star <= Math.floor(rating) ? "#C9A24A" : "none",
                }}
              />
            ))}
            <span className="text-xs text-[oklch(0.56_0.016_65)] ml-1 font-sans">
              {rating}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[oklch(0.56_0.016_65)] font-sans">
            <Clock className="w-3.5 h-3.5" />
            {Number(recipe.prep_time_min)} min
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-base font-bold text-[oklch(0.145_0_0)] leading-snug"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {name}
        </h3>
      </div>
    </motion.div>
  );
}
