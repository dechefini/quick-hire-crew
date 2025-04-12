
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  additionalText?: string;
  learnMoreLink?: string;
  details?: {
    description: string;
    keyFeatures: string[];
  };
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  additionalText, 
  learnMoreLink,
  details
}: FeatureCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLearnMoreClick = () => {
    if (details) {
      setIsDialogOpen(true);
      // Show a toast notification
      toast({
        title: `Exploring ${title}`,
        description: "Check out the detailed features",
        duration: 3000,
      });
    } else if (learnMoreLink) {
      // External link handling would go here
    }
  };

  return (
    <>
      <div 
        className="bg-white p-8 rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`bg-primary bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-6 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {additionalText && <p className="text-gray-600 mb-4">{additionalText}</p>}
        
        {details ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleLearnMoreClick}
                  className="text-primary inline-flex items-center gap-1 font-medium hover:underline group"
                >
                  Learn More 
                  <ArrowRight 
                    size={16} 
                    className="transition-transform duration-300 group-hover:translate-x-1" 
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to see detailed features</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : learnMoreLink ? (
          <Link 
            to={learnMoreLink} 
            className="text-primary inline-flex items-center gap-1 font-medium hover:underline group"
          >
            Learn More 
            <ArrowRight 
              size={16} 
              className="transition-transform duration-300 group-hover:translate-x-1" 
            />
          </Link>
        ) : null}
      </div>

      {details && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
            <div className="relative">
              <div className="bg-primary bg-opacity-10 p-6 flex items-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-primary mr-4">
                  {icon}
                </div>
                <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6">{details.description}</p>
                
                <h4 className="text-lg font-semibold mb-4">Key Features:</h4>
                <ul className="space-y-3">
                  {details.keyFeatures.map((feature, index) => (
                    <li 
                      key={index} 
                      className="flex items-start gap-2 animate-in fade-in slide-in-from-right" 
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Plus size={16} className="text-primary mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FeatureCard;
