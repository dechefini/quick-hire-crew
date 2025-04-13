
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  Briefcase, 
  CreditCard,
  Settings
} from "lucide-react";

export const Sidebar = () => {
  const { t } = useLanguage();
  
  const sidebarItems = [
    {
      name: t("dashboard.sidebar.dashboard"),
      icon: <LayoutDashboard size={20} />,
      path: "/contractor/dashboard",
      active: true
    },
    {
      name: t("dashboard.sidebar.messages"),
      icon: <MessageSquare size={20} />,
      path: "/contractor/messages",
      active: false
    },
    {
      name: t("dashboard.sidebar.profile"),
      icon: <User size={20} />,
      path: "/contractor/profile",
      active: false
    },
    {
      name: t("dashboard.sidebar.availableJobs"),
      icon: <Briefcase size={20} />,
      path: "/contractor/jobs",
      active: false
    },
    {
      name: t("dashboard.sidebar.payments"),
      icon: <CreditCard size={20} />,
      path: "/contractor/payments",
      active: false
    },
    {
      name: t("dashboard.sidebar.settings"),
      icon: <Settings size={20} />,
      path: "/contractor/settings",
      active: false
    }
  ];
  
  return (
    <div className="hidden md:flex md:flex-col w-64 bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/9db3df61-b721-4237-87f3-d7f98f913285.png" 
            alt="Quick Hire Crew Logo" 
            className="h-8 w-auto" 
          />
          <span className="text-lg font-bold">QuickHireCrew</span>
        </Link>
      </div>
      <nav className="flex flex-col flex-1 p-4 space-y-1">
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
              item.active 
                ? "bg-primary-light text-primary font-medium" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
