
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Layout } from "@/components/dashboard/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { JobList } from "@/components/dashboard/JobList";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

const ContractorDashboard = () => {
  const { t } = useLanguage();
  const [userName, setUserName] = useState("Worker 1");
  
  // Mock data for the dashboard
  const stats = [
    {
      title: t("dashboard.totalApplications"),
      value: "12",
      icon: "briefcase",
      description: t("dashboard.jobsApplied"),
    },
    {
      title: t("dashboard.acceptedJobs"),
      value: "0",
      icon: "star",
      description: t("dashboard.successfullyLanded"),
    },
    {
      title: t("dashboard.weeklyEarning"),
      value: "$0",
      icon: "dollar",
      description: t("dashboard.basedOn40hr"),
    },
    {
      title: t("dashboard.matchScore"),
      value: "0%",
      icon: "trending-up",
      description: t("dashboard.acceptanceRate"),
    },
  ];
  
  const activeApplications = [
    { 
      id: 1, 
      title: "Commercial Office Renovation", 
      status: "pending" 
    },
    { 
      id: 2, 
      title: "Residential Bathroom Remodel", 
      status: "pending" 
    },
    { 
      id: 3, 
      title: "Custom Outdoor Kitchen Build", 
      status: "pending" 
    },
    { 
      id: 4, 
      title: "Retail Store Buildout", 
      status: "pending" 
    },
    { 
      id: 5, 
      title: "Commercial Office Renovation", 
      status: "pending"
    },
  ];
  
  const availableJobs = [
    { 
      id: 1, 
      title: "Commercial Office Renovation", 
      rate: "$38.00/hr" 
    },
    { 
      id: 2, 
      title: "Residential Bathroom Remodel", 
      rate: "$35.00/hr" 
    },
    { 
      id: 3, 
      title: "New Home Construction - Framing", 
      rate: "$42.00/hr" 
    },
    { 
      id: 4, 
      title: "Custom Outdoor Kitchen Build", 
      rate: "$40.00/hr" 
    },
  ];
  
  const recentActivity = [
    { 
      id: 1, 
      status: "pending", 
      title: "Commercial Office Renovation" 
    },
    { 
      id: 2, 
      status: "pending", 
      title: "Residential Bathroom Remodel" 
    },
    { 
      id: 3, 
      status: "pending", 
      title: "Custom Outdoor Kitchen Build" 
    },
    { 
      id: 4, 
      status: "pending", 
      title: "Retail Store Buildout" 
    },
    { 
      id: 5, 
      status: "pending", 
      title: "Commercial Office Renovation" 
    },
  ];
  
  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {t("dashboard.welcomeBack", { name: userName })}
            </h1>
            <p className="text-gray-600">
              {t("dashboard.jobSearchProgress")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <Button className="bg-primary text-white gap-2">
              <Search size={18} />
              {t("dashboard.findJobs")}
            </Button>
            <Button variant="outline" className="gap-2">
              <MapPin size={18} />
              {t("dashboard.myProfile")}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <JobList
              title={t("dashboard.activeApplications")}
              jobs={activeApplications}
              type="applications"
            />
          </div>
          <div className="lg:col-span-1">
            <JobList
              title={t("dashboard.availableJobs")}
              jobs={availableJobs}
              type="available"
            />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed
              title={t("dashboard.recentActivity")}
              activities={recentActivity}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContractorDashboard;
