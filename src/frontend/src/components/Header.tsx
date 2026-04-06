import { Leaf, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { key: "nav.home", href: "#hero" },
    { key: "nav.plans", href: "#meal-plans" },
    { key: "nav.recipes", href: "#recipes" },
    { key: "nav.about", href: "#about" },
  ];

  const toggleLanguage = () => setLanguage(language === "fr" ? "en" : "fr");

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-full bg-[oklch(0.36_0.082_163)] flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "oklch(0.72 0.09 75)",
            }}
          >
            Saveur Santé
          </span>
        </a>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm font-medium text-[oklch(0.145_0_0)] hover:text-[oklch(0.36_0.082_163)] transition-colors duration-200 font-sans"
              data-ocid="nav.link"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLanguage}
            className="text-sm font-medium text-[oklch(0.56_0.016_65)] hover:text-[oklch(0.36_0.082_163)] transition-colors px-2 py-1 rounded font-sans"
            data-ocid="nav.toggle"
            aria-label="Toggle language"
          >
            {language === "fr" ? "EN" : "FR"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-[oklch(0.145_0_0)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
          data-ocid="nav.toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-[oklch(0.9_0.02_80)] px-4 py-4"
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm font-medium text-[oklch(0.145_0_0)] hover:text-[oklch(0.36_0.082_163)] transition-colors font-sans"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                {t(link.key)}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                toggleLanguage();
                setMobileOpen(false);
              }}
              className="text-sm font-medium text-[oklch(0.56_0.016_65)] hover:text-[oklch(0.36_0.082_163)] transition-colors text-left font-sans"
              data-ocid="nav.toggle"
            >
              {t("nav.language")}
            </button>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
