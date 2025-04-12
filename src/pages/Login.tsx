
import LoginForm from "@/components/LoginForm";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Add a small delay before animation starts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 overflow-hidden">
      <div 
        className={`w-full max-w-md transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <LoginForm />
      </div>
      
      {/* Decorative elements for premium feel */}
      <div className="absolute top-0 -left-48 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-48 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
    </div>
  );
};

export default Login;
