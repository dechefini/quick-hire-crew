
import { 
  Building2, Users, Target, BarChart3 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <section className="py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            {t("about.title")}
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            {t("about.subtitle")}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg border">
              <h2 className="text-2xl font-bold text-primary mb-4">{t("about.mission")}</h2>
              <p className="text-gray-600">
                {t("about.missionText")}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border">
              <h2 className="text-2xl font-bold text-primary mb-4">{t("about.vision")}</h2>
              <p className="text-gray-600">
                {t("about.visionText")}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="text-primary" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-gray-600">{t("about.companies")}</p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-2">10,000+</h3>
              <p className="text-gray-600">{t("about.workers")}</p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-primary" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-2">25,000+</h3>
              <p className="text-gray-600">{t("about.jobsCompleted")}</p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-primary" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-2">95%</h3>
              <p className="text-gray-600">{t("about.successRate")}</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">{t("about.howItWorks")}</h2>
          
          <p className="text-lg text-gray-600 max-w-5xl mb-16">
            {t("about.howItWorksText")}
          </p>
          
          <h2 className="text-3xl font-bold mb-8">{t("about.whyChooseUs")}</h2>
          
          <ul className="space-y-4 text-lg text-gray-600 max-w-5xl mb-16">
            <li className="flex items-start gap-2">
              <div className="text-primary font-bold text-lg">•</div>
              <div>{t("about.quickMatching")}</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="text-primary font-bold text-lg">•</div>
              <div>{t("about.verifiedWorkers")}</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="text-primary font-bold text-lg">•</div>
              <div>{t("about.securePayment")}</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="text-primary font-bold text-lg">•</div>
              <div>{t("about.realTimeCommunication")}</div>
            </li>
            <li className="flex items-start gap-2">
              <div className="text-primary font-bold text-lg">•</div>
              <div>{t("about.ratingSystem")}</div>
            </li>
          </ul>
          
          <div className="text-center">
            <Link to="/register">
              <Button className="bg-primary text-white px-8 py-6 text-lg rounded-md">
                {t("about.joinToday")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
