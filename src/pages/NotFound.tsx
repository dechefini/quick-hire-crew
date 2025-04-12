
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">{t("notFound.title")}</h1>
      <p className="text-xl text-gray-600 mb-8">{t("notFound.subtitle")}</p>
      <p className="text-gray-500 max-w-md text-center mb-8">
        {t("notFound.message")}
      </p>
      <Link to="/">
        <Button className="bg-primary text-white flex items-center gap-2">
          <Home size={18} />
          {t("notFound.return")}
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
