import { Leaf } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  const footerLinks = [
    { key: "footer.links.plans", href: "#meal-plans" },
    { key: "footer.links.recipes", href: "#recipes" },
    { key: "footer.links.about", href: "#about" },
    { key: "footer.links.contact", href: "https://caffeine.ai" },
    { key: "footer.links.privacy", href: "https://caffeine.ai" },
    { key: "footer.links.terms", href: "https://caffeine.ai" },
  ];

  return (
    <footer
      style={{ backgroundColor: "oklch(0.30 0.075 163)" }}
      className="py-12"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "oklch(0.72 0.09 75)" }}
            >
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-xl font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "oklch(0.72 0.09 75)",
              }}
            >
              Saveur Santé
            </span>
          </div>
          <p className="text-sm text-white/60 font-sans">
            {t("footer.tagline")}
          </p>
        </div>

        {/* Nav Links */}
        <nav
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8"
          aria-label="Footer navigation"
        >
          {footerLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors font-sans"
              data-ocid="nav.link"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        {/* Social icons */}
        <div className="flex justify-center gap-4 mb-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <SiInstagram className="w-4 h-4" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <SiFacebook className="w-4 h-4" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <SiX className="w-4 h-4" />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-center text-xs text-white/50 font-sans">
            © {year}. Built with ❤️ using{" "}
            <a
              href={caffeineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/80 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
