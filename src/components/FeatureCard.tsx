
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  additionalText?: string;
  learnMoreLink?: string;
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  additionalText, 
  learnMoreLink 
}: FeatureCardProps) => {
  return (
    <div className="bg-white p-8 rounded-lg border shadow-sm">
      <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {additionalText && <p className="text-gray-600 mb-4">{additionalText}</p>}
      {learnMoreLink && (
        <Link to={learnMoreLink} className="text-primary inline-flex items-center gap-1 font-medium hover:underline">
          Learn More <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
};

export default FeatureCard;
