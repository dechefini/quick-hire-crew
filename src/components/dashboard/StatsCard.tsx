
import { 
  Briefcase, 
  Star, 
  DollarSign, 
  TrendingUp 
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  description: string;
}

export const StatsCard = ({ title, value, icon, description }: StatsCardProps) => {
  const renderIcon = () => {
    switch (icon) {
      case "briefcase":
        return <Briefcase size={24} className="text-primary" />;
      case "star":
        return <Star size={24} className="text-blue-500" />;
      case "dollar":
        return <DollarSign size={24} className="text-green-500" />;
      case "trending-up":
        return <TrendingUp size={24} className="text-indigo-500" />;
      default:
        return <Briefcase size={24} className="text-primary" />;
    }
  };

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-gray-50">
          {renderIcon()}
        </div>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </Card>
  );
};
