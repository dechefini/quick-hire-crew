
import FeatureCard from "@/components/FeatureCard";
import { 
  Search, MessageSquare, CreditCard, Shield, Clock, Users 
} from "lucide-react";

const Features = () => {
  return (
    <>
      <section className="py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            Quick Hire Crew Features
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            Everything you need to manage temporary construction workforce
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FeatureCard 
              icon={<Search size={24} />}
              title="Smart Matching"
              description="Advanced algorithm to match workers with the right jobs based on skills and experience."
              additionalText="Our AI-powered matching system considers location, skills, experience, and availability to ensure the perfect fit for every job."
              learnMoreLink="/features/matching"
            />
            
            <FeatureCard 
              icon={<MessageSquare size={24} />}
              title="Instant Messaging"
              description="Real-time communication between companies and workers for better coordination."
              additionalText="Built-in chat system with read receipts, file sharing, and automatic notifications to keep everyone in sync."
              learnMoreLink="/features/messaging"
            />
            
            <FeatureCard 
              icon={<CreditCard size={24} />}
              title="Secure Payments"
              description="Safe and reliable payment processing for all completed work."
              additionalText="Protected by industry-standard encryption with automated invoicing and payment tracking."
              learnMoreLink="/features/payments"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield size={24} />}
              title="Verified Profiles"
              description="All workers and companies are verified for safety and reliability."
              additionalText="Multi-step verification process including document checks and reference verification for peace of mind."
              learnMoreLink="/features/verification"
            />
            
            <FeatureCard 
              icon={<Clock size={24} />}
              title="Quick Hiring"
              description="Streamlined process to hire temporary workers within hours."
              additionalText="Reduce hiring time from weeks to hours with our optimized workflows and instant matching."
              learnMoreLink="/features/quick-hire"
            />
            
            <FeatureCard 
              icon={<Users size={24} />}
              title="Team Management"
              description="Easy tools to manage multiple workers and projects."
              additionalText="Comprehensive dashboard for tracking attendance, performance, and project progress in real-time."
              learnMoreLink="/features/team"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
