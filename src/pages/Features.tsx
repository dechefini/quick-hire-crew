
import FeatureCard from "@/components/FeatureCard";
import { 
  Search, MessageSquare, CreditCard, Shield, Clock, Users 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  // Feature details for modal dialogs
  const featureDetails = {
    smartMatching: {
      description: t("features.smartMatchingDesc"),
      keyFeatures: [
        "Machine learning algorithms analyze past successful matches",
        "Real-time availability tracking and scheduling optimization",
        "Skills assessment and verification system",
        "Location-based matching with commute time estimation",
        "Automated skill gap analysis and recommendations"
      ]
    },
    instantMessaging: {
      description: t("features.messagingDesc"),
      keyFeatures: [
        "End-to-end encrypted messaging for security",
        "File sharing capabilities for documents and images",
        "Group chat functionality for team coordination",
        "Automated notifications and reminders",
        "Message translation for multi-language support"
      ]
    },
    securePayments: {
      description: t("features.paymentsDesc"),
      keyFeatures: [
        "Multiple payment method support (Credit Cards, Bank Transfers)",
        "Automated timesheet and invoice generation",
        "Escrow service for large projects",
        "Real-time payment tracking and history",
        "Tax document generation and management"
      ]
    },
    verifiedProfiles: {
      description: t("features.profilesDesc"),
      keyFeatures: [
        "Background check integration",
        "Skills certification verification",
        "Company registration validation",
        "Reference checking system",
        "Regular profile audits and updates"
      ]
    },
    quickHiring: {
      description: t("features.quickHiringDesc"),
      keyFeatures: [
        "One-click job posting with smart templates",
        "Automated candidate shortlisting",
        "Integrated scheduling for interviews",
        "Digital contract signing",
        "Automated onboarding workflows"
      ]
    },
    teamManagement: {
      description: t("features.teamManagementDesc"),
      keyFeatures: [
        "Real-time attendance tracking",
        "Performance analytics and reporting",
        "Project milestone tracking",
        "Team scheduling and rotation management",
        "Automated progress reports"
      ]
    }
  };

  return (
    <>
      <section className="py-16 animate-in fade-in duration-700">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4 relative">
            <span className="relative">
              {t("features.title")}
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full transform scale-x-0 transition-transform duration-500 origin-left animate-in" style={{ animationDelay: "300ms", transform: "scaleX(1)" }}></span>
            </span>
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16 animate-in fade-in duration-700" style={{ animationDelay: "400ms" }}>
            {t("features.subtitle")}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "100ms" }}>
              <FeatureCard 
                icon={<Search size={24} />}
                title={t("features.smartMatching")}
                description={t("features.smartMatchingDesc")}
                additionalText={t("features.smartMatchingAdd")}
                details={featureDetails.smartMatching}
              />
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "200ms" }}>
              <FeatureCard 
                icon={<MessageSquare size={24} />}
                title={t("features.messaging")}
                description={t("features.messagingDesc")}
                additionalText={t("features.messagingAdd")}
                details={featureDetails.instantMessaging}
              />
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "300ms" }}>
              <FeatureCard 
                icon={<CreditCard size={24} />}
                title={t("features.payments")}
                description={t("features.paymentsDesc")}
                additionalText={t("features.paymentsAdd")}
                details={featureDetails.securePayments}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "400ms" }}>
              <FeatureCard 
                icon={<Shield size={24} />}
                title={t("features.profiles")}
                description={t("features.profilesDesc")}
                additionalText={t("features.profilesAdd")}
                details={featureDetails.verifiedProfiles}
              />
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "500ms" }}>
              <FeatureCard 
                icon={<Clock size={24} />}
                title={t("features.quickHiring")}
                description={t("features.quickHiringDesc")}
                additionalText={t("features.quickHiringAdd")}
                details={featureDetails.quickHiring}
              />
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "600ms" }}>
              <FeatureCard 
                icon={<Users size={24} />}
                title={t("features.teamManagement")}
                description={t("features.teamManagementDesc")}
                additionalText={t("features.teamManagementAdd")}
                details={featureDetails.teamManagement}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
