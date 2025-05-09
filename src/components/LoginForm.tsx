
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserIcon, Lock, LogIn, HomeIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoginForm = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg shadow-md max-w-md w-full mx-auto p-8">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
          <Lock className="text-primary" size={32} />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-2">{t("auth.login")}</h1>
      <p className="text-gray-500 text-center mb-6">{t("auth.welcomeBack")}</p>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.emailOrUsername")}
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              id="email" 
              placeholder={t("auth.enterEmailOrUsername")} 
              className="pl-10 bg-blue-50 border-0"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t("auth.password")}
            </label>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              {t("auth.forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••••"
              className="pl-10 bg-blue-50 border-0"
            />
          </div>
        </div>
        
        <Button className="w-full py-6 bg-primary text-white">
          <LogIn size={18} className="mr-2" />
          {t("auth.login")}
        </Button>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {t("auth.noAccount")} <Link to="/register" className="text-primary font-medium hover:underline">{t("auth.register")}</Link>
        </p>
        <Link to="/" className="inline-flex items-center justify-center gap-2 text-gray-600 mt-4 hover:text-primary">
          <HomeIcon size={16} />
          {t("auth.backToHome")}
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
