
import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex h-screen bg-gray-50" data-language={language}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
