import AboutSection from "./components/AboutSection";
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import MealPlansSection from "./components/MealPlansSection";
import PersonalizedPlanSection from "./components/PersonalizedPlanSection";
import RecipesSection from "./components/RecipesSection";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <PersonalizedPlanSection />
          <MealPlansSection />
          <RecipesSection />
          <AboutSection />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </LanguageProvider>
  );
}
