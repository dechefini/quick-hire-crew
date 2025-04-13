
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Bell,
  Globe,
  Menu,
  User,
  ChevronRight,
  Search,
  MessageSquare,
  Briefcase,
  CreditCard,
  Settings,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const TopBar = () => {
  const { language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value as "english" | "spanish");
  };
  
  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </Button>
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/9db3df61-b721-4237-87f3-d7f98f913285.png" 
              alt="Quick Hire Crew Logo" 
              className="h-8 w-auto" 
            />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs, applicants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select 
            defaultValue={language} 
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-[70px] h-8 px-2 border-none">
              <div className="flex items-center gap-1">
                <Globe size={16} />
                <SelectValue placeholder="EN" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">EN</SelectItem>
              <SelectItem value="spanish">ES</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center">
            <div className="hidden sm:flex flex-col mr-2 text-right">
              <span className="text-sm font-medium">Worker 1</span>
              <span className="text-xs text-gray-500">Contractor</span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-100">
              <User size={20} />
            </Button>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="px-4 py-2">
            <Link to="/contractor/dashboard" className="flex items-center justify-between py-2 text-primary font-medium">
              <div className="flex items-center">
                <LayoutDashboard size={18} className="mr-3" />
                Dashboard
              </div>
              <ChevronRight size={16} />
            </Link>
            <Link to="/contractor/messages" className="flex items-center justify-between py-2 text-gray-600">
              <div className="flex items-center">
                <MessageSquare size={18} className="mr-3" />
                Messages
              </div>
              <ChevronRight size={16} />
            </Link>
            <Link to="/contractor/profile" className="flex items-center justify-between py-2 text-gray-600">
              <div className="flex items-center">
                <User size={18} className="mr-3" />
                Profile
              </div>
              <ChevronRight size={16} />
            </Link>
            <Link to="/contractor/jobs" className="flex items-center justify-between py-2 text-gray-600">
              <div className="flex items-center">
                <Briefcase size={18} className="mr-3" />
                Available Jobs
              </div>
              <ChevronRight size={16} />
            </Link>
            <Link to="/contractor/payments" className="flex items-center justify-between py-2 text-gray-600">
              <div className="flex items-center">
                <CreditCard size={18} className="mr-3" />
                Payments
              </div>
              <ChevronRight size={16} />
            </Link>
            <Link to="/contractor/settings" className="flex items-center justify-between py-2 text-gray-600">
              <div className="flex items-center">
                <Settings size={18} className="mr-3" />
                Settings
              </div>
              <ChevronRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
