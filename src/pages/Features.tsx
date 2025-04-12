
import FeatureCard from "@/components/FeatureCard";
import { 
  Search, MessageSquare, CreditCard, Shield, Clock, Users 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Features = () => {
  const isMobile = useIsMobile();

  // Feature details for modal dialogs
  const featureDetails = {
    smartMatching: {
      description: "Advanced algorithm to match workers with the right jobs based on skills and experience.",
      keyFeatures: [
        "Machine learning algorithms analyze past successful matches",
        "Real-time availability tracking and scheduling optimization",
        "Skills assessment and verification system",
        "Location-based matching with commute time estimation",
        "Automated skill gap analysis and recommendations"
      ]
    },
    instantMessaging: {
      description: "Real-time communication between companies and workers for better coordination.",
      keyFeatures: [
        "End-to-end encrypted messaging for security",
        "File sharing capabilities for documents and images",
        "Group chat functionality for team coordination",
        "Automated notifications and reminders",
        "Message translation for multi-language support"
      ]
    },
    securePayments: {
      description: "Safe and reliable payment processing for all completed work.",
      keyFeatures: [
        "Multiple payment method support (Credit Cards, Bank Transfers)",
        "Automated timesheet and invoice generation",
        "Escrow service for large projects",
        "Real-time payment tracking and history",
        "Tax document generation and management"
      ]
    },
    verifiedProfiles: {
      description: "All workers and companies are verified for safety and reliability.",
      keyFeatures: [
        "Background check integration",
        "Skills certification verification",
        "Company registration validation",
        "Reference checking system",
        "Regular profile audits and updates"
      ]
    },
    quickHiring: {
      description: "Streamlined process to hire temporary workers within hours.",
      keyFeatures: [
        "One-click job posting with smart templates",
        "Automated candidate shortlisting",
        "Integrated scheduling for interviews",
        "Digital contract signing",
        "Automated onboarding workflows"
      ]
    },
    teamManagement: {
      description: "Easy tools to manage multiple workers and projects.",
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
              Quick Hire Crew Features
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full transform scale-x-0 transition-transform duration-500 origin-left animate-in" style={{ animationDelay: "300ms", transform: "scaleX(1)" }}></span>
            </span>
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16 animate-in fade-in duration-700" style={{ animationDelay: "400ms" }}>
            Everything you need to manage temporary construction workforce
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "100ms" }}>
              <FeatureCard 
                icon={<Search size={24} />}
                title="Smart Matching"
                description="Advanced algorithm to match workers with the right jobs based on skills and experience."
                additionalText="Our AI-powered matching system considers location, skills, experience, and availability to ensure the perfect fit for every job."
                details={featureDetails.smartMatching}
              />
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "200ms" }}>
              <FeatureCard 
                icon={<MessageSquare size={24} />}
                title="Instant Messaging"
                description="Real-time communication between companies and workers for better coordination."
                additionalText="Built-in chat system with read receipts, file sharing, and automatic notifications to keep everyone in sync."
                details={featureDetails.instantMessaging}
              />
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "300ms" }}>
              <FeatureCard 
                icon={<CreditCard size={24} />}
                title="Secure Payments"
                description="Safe and reliable payment processing for all completed work."
                additionalText="Protected by industry-standard encryption with automated invoicing and payment tracking."
                details={featureDetails.securePayments}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "400ms" }}>
              <FeatureCard 
                icon={<Shield size={24} />}
                title="Verified Profiles"
                description="All workers and companies are verified for safety and reliability."
                additionalText="Multi-step verification process including document checks and reference verification for peace of mind."
                details={featureDetails.verifiedProfiles}
              />
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "500ms" }}>
              <FeatureCard 
                icon={<Clock size={24} />}
                title="Quick Hiring"
                description="Streamlined process to hire temporary workers within hours."
                additionalText="Reduce hiring time from weeks to hours with our optimized workflows and instant matching."
                details={featureDetails.quickHiring}
              />
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-3" style={{ animationDelay: "600ms" }}>
              <FeatureCard 
                icon={<Users size={24} />}
                title="Team Management"
                description="Easy tools to manage multiple workers and projects."
                additionalText="Comprehensive dashboard for tracking attendance, performance, and project progress in real-time."
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
