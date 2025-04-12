
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserIcon, Building2, HomeIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RegisterForm = () => {
  const [accountType, setAccountType] = useState<'contractor' | 'company' | null>(null);
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-md max-w-md w-full mx-auto p-8">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
          <UserIcon className="text-primary" size={32} />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-2">{t("auth.createAccount")}</h1>
      <p className="text-gray-500 text-center mb-6">{t("auth.signUpToStart")}</p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.username")}
            </label>
            <Input 
              id="username" 
              placeholder={t("auth.username")} 
              className="bg-blue-50 border-0"
            />
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.fullName")}
            </label>
            <Input 
              id="fullName" 
              placeholder={t("auth.fullName")} 
              className="bg-blue-50 border-0"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            {t("auth.phoneNumber")}
          </label>
          <Input 
            id="phoneNumber" 
            placeholder={t("auth.phoneNumber")} 
            className="bg-blue-50 border-0"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.password")}
            </label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••••"
              className="bg-blue-50 border-0"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.confirmPassword")}
            </label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••••"
              className="bg-blue-50 border-0"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("auth.accountType")}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setAccountType('contractor')}
              className={`p-4 border rounded-md flex flex-col items-center justify-center gap-2 transition-colors
                ${accountType === 'contractor' ? 'border-primary text-primary' : 'border-gray-200 text-gray-500'}`}
            >
              <UserIcon size={28} />
              <span>{t("auth.contractor")}</span>
            </button>
            <button 
              type="button"
              onClick={() => setAccountType('company')}
              className={`p-4 border rounded-md flex flex-col items-center justify-center gap-2 transition-colors
                ${accountType === 'company' ? 'border-primary text-primary' : 'border-gray-200 text-gray-500'}`}
            >
              <Building2 size={28} />
              <span>{t("auth.company")}</span>
            </button>
          </div>
        </div>
        
        <Button className="w-full py-6 bg-primary text-white">
          <Building2 size={18} className="mr-2" />
          {t("auth.registerAccount")}
        </Button>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {t("auth.haveAccount")} <Link to="/login" className="text-primary font-medium hover:underline">{t("auth.loginNow")}</Link>
        </p>
        <Link to="/" className="inline-flex items-center justify-center gap-2 text-gray-600 mt-4 hover:text-primary">
          <HomeIcon size={16} />
          {t("auth.backToHome")}
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
