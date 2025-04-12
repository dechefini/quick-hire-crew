
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  stat: string;
  description: string;
}

const StatCard = ({ icon, stat, description }: StatCardProps) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm text-center flex flex-col items-center">
      <div className="text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-3xl font-bold mb-2">{stat}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default StatCard;
