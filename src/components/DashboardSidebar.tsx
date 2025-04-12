
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LayoutDashboard, MessagesSquare, User, Briefcase, CreditCard, Settings } from "lucide-react";

const DashboardSidebar = () => {
  const { t } = useLanguage();
  
  // Active menu item (will be dynamic in a real implementation)
  const activeMenuItem = "dashboard";
  
  const menuItems = [
    { id: "dashboard", label: t("sidebar.dashboard"), icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { id: "messages", label: t("sidebar.messages"), icon: <MessagesSquare size={20} />, path: "/messages" },
    { id: "profile", label: t("sidebar.profile"), icon: <User size={20} />, path: "/profile" },
    { id: "jobs", label: t("sidebar.availableJobs"), icon: <Briefcase size={20} />, path: "/jobs" },
    { id: "payments", label: t("sidebar.payments"), icon: <CreditCard size={20} />, path: "/payments" },
    { id: "settings", label: t("sidebar.settings"), icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/25511c15-7856-463f-af8b-2935d9ecb114.png" alt="QuickHireCrew" className="h-8 w-auto" />
          <span className="font-semibold text-lg">QuickHireCrew</span>
        </Link>
      </div>
      
      {/* Menu Items */}
      <nav className="flex-1 pt-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors ${
                  activeMenuItem === item.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Info */}
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-700">
            <User size={20} />
          </div>
          <div>
            <div className="font-medium">Worker 1</div>
            <div className="text-sm text-gray-500">{t("sidebar.contractor")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
