
import React, { createContext, useContext, useState, useEffect } from "react";

type LanguageType = "english" | "spanish";

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  translations: Record<string, Record<string, string>>;
  t: (key: string) => string;
}

const translations = {
  english: {
    // Navbar
    "nav.about": "About",
    "nav.features": "Features",
    "nav.contact": "Contact",
    "nav.register": "Register",
    "nav.login": "Login",
    
    // Hero
    "hero.title": "Build Your Future in Construction",
    "hero.subtitle": "The fastest way to find work or hire skilled contractors in your area. Join thousands of professionals making connections every day.",
    "hero.language": "Language:",
    "hero.needWork": "I Need Work",
    "hero.needHire": "I Need to Hire",
  },
  spanish: {
    // Navbar
    "nav.about": "Acerca de",
    "nav.features": "Características",
    "nav.contact": "Contacto",
    "nav.register": "Registrarse",
    "nav.login": "Iniciar Sesión",
    
    // Hero
    "hero.title": "Construye Tu Futuro en Construcción",
    "hero.subtitle": "La forma más rápida de encontrar trabajo o contratar a profesionales calificados en tu área. Únete a miles de profesionales que hacen conexiones todos los días.",
    "hero.language": "Idioma:",
    "hero.needWork": "Necesito Trabajo",
    "hero.needHire": "Necesito Contratar",
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "english",
  setLanguage: () => {},
  translations,
  t: () => "",
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with stored preference or default to English
  const [language, setLanguageState] = useState<LanguageType>(() => {
    const storedLanguage = localStorage.getItem("language");
    return (storedLanguage as LanguageType) || "english";
  });

  // Translate function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Update language and store in localStorage
  const setLanguage = (newLanguage: LanguageType) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  // Effect to set language based on localStorage when component mounts
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as LanguageType;
    if (storedLanguage && storedLanguage !== language) {
      setLanguageState(storedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
