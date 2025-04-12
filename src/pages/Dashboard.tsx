
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, User, TrendingUp, DollarSign, BriefcaseIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/DashboardSidebar";
import StatCard from "@/components/StatCard";

// Mock data for demonstration
const mockApplications = [
  { id: 1, title: "Commercial Office Renovation", status: "pending" },
  { id: 2, title: "Residential Bathroom Remodel", status: "pending" },
  { id: 3, title: "Custom Outdoor Kitchen Build", status: "pending" },
  { id: 4, title: "Retail Store Buildout", status: "pending" },
  { id: 5, title: "Commercial Office Renovation", status: "pending" },
];

const mockAvailableJobs = [
  { id: 1, title: "Commercial Office Renovation", rate: "$38.00/hr" },
  { id: 2, title: "Residential Bathroom Remodel", rate: "$35.00/hr" },
  { id: 3, title: "New Home Construction - Framing", rate: "$42.00/hr" },
  { id: 4, title: "Custom Outdoor Kitchen Build", rate: "$40.00/hr" },
];

const mockRecentActivity = [
  { id: 1, status: "pending", title: "Commercial Office Renovation" },
  { id: 2, status: "pending", title: "Residential Bathroom Remodel" },
  { id: 3, status: "pending", title: "Custom Outdoor Kitchen Build" },
  { id: 4, status: "pending", title: "Retail Store Buildout" },
  { id: 5, status: "pending", title: "Commercial Office Renovation" },
];

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const [workerName, setWorkerName] = useState("Worker 1");

  useEffect(() => {
    // Add animation on load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 p-8">
        <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{t("dashboard.welcomeBack", { name: workerName })}</h1>
              <p className="text-gray-500 mt-1">{t("dashboard.jobSearchProgress")}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white">
                <Search className="mr-2 h-4 w-4" />
                {t("dashboard.findJobs")}
              </Button>
              <Button>
                <User className="mr-2 h-4 w-4" />
                {t("dashboard.myProfile")}
              </Button>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={<BriefcaseIcon size={24} className="text-primary" />}
              stat="12"
              description={t("dashboard.jobsAppliedTo")}
            />
            <StatCard 
              icon={<BriefcaseIcon size={24} className="text-blue-500" />}
              stat="0"
              description={t("dashboard.successfullyLanded")}
            />
            <StatCard 
              icon={<DollarSign size={24} className="text-green-500" />}
              stat="$0"
              description={t("dashboard.basedOn40hr")}
            />
            <StatCard 
              icon={<TrendingUp size={24} className="text-indigo-500" />}
              stat="0%"
              description={t("dashboard.jobAcceptanceRate")}
            />
          </div>
          
          {/* Applications and Jobs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Applications */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t("dashboard.activeApplications")}</h2>
              
              <div className="space-y-4">
                {mockApplications.map((app) => (
                  <div key={app.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                    <div>
                      <h3 className="font-medium">{app.title}</h3>
                      <span className="text-sm text-gray-500">{app.status}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Available Jobs */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t("dashboard.availableJobs")}</h2>
              
              <div className="space-y-4">
                {mockAvailableJobs.map((job) => (
                  <div key={job.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <span className="text-sm text-blue-500">{job.rate}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t("dashboard.recentActivity")}</h2>
              
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center border-b pb-3 last:border-0">
                    <div className="w-20 text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-center mr-3">
                      {activity.status}
                    </div>
                    <h3 className="font-medium">{activity.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
