
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const isMobile = useIsMobile();
  const { language, setLanguage, t } = useLanguage();
  
  const handleLanguageChange = (selectedLanguage: "english" | "spanish") => {
    setLanguage(selectedLanguage);
  };
  
  return (
    <section className="hero-section py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-primary mb-6 md:mb-8">
          {t("hero.title")}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-8 md:mb-12 px-4">
          {t("hero.subtitle")}
        </p>
        
        <div className="mb-6 md:mb-10">
          <div className="inline-flex flex-wrap justify-center items-center gap-2 bg-white rounded-md p-2 shadow-sm mb-8">
            <span className="text-gray-600 mr-2">{t("hero.language")}</span>
            <Button 
              variant={language === "english" ? "default" : "ghost"} 
              className={language === "english" ? "bg-primary text-white rounded-md px-3 md:px-4 py-1 h-auto" : "text-gray-700 rounded-md px-3 md:px-4 py-1 h-auto"}
              onClick={() => handleLanguageChange("english")}
            >
              English
            </Button>
            <Button 
              variant={language === "spanish" ? "default" : "ghost"} 
              className={language === "spanish" ? "bg-primary text-white rounded-md px-3 md:px-4 py-1 h-auto" : "text-gray-700 rounded-md px-3 md:px-4 py-1 h-auto"}
              onClick={() => handleLanguageChange("spanish")}
            >
              Español
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 md:mt-8 px-4 sm:px-0">
          <Link to="/work" className="w-full sm:w-auto">
            <Button className="bg-primary text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-md w-full">
              {t("hero.needWork")}
            </Button>
          </Link>
          <Link to="/hire" className="w-full sm:w-auto">
            <Button variant="outline" className="bg-white text-primary border-primary px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-md w-full">
              {t("hero.needHire")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
