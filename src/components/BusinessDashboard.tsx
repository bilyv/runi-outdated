import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./modules/Dashboard";
import { Products } from "./modules/Products";
import { Sales } from "./modules/Sales";
import { Expenses } from "./modules/Expenses";
import { Documents } from "./modules/Documents";
import { Reports } from "./modules/Reports";
import { Users } from "./modules/Users";
import { Settings } from "./modules/Settings";

export type ModuleType =
  | "dashboard"
  | "products"
  | "sales"
  | "expenses"
  | "documents"
  | "reports"
  | "users"
  | "settings";

import { Navbar } from "./Navbar";
import { Menu } from "lucide-react";

export function BusinessDashboard() {
  const [activeModule, setActiveModule] = useState<ModuleType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "sales":
        return <Sales />;
      case "expenses":
        return <Expenses />;
      case "documents":
        return <Documents />;
      case "reports":
        return <Reports />;
      case "users":
        return <Users />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={20} />
      </button>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:static fixed inset-y-0 left-0 z-10`}>
        <Sidebar activeModule={activeModule} onModuleChange={(module) => {
          setActiveModule(module);
          // Close sidebar on mobile after selection
          if (window.innerWidth < 768) setSidebarOpen(false);
        }} />
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-5 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main content */}
      <main className="flex-1 overflow-auto md:ml-0">
        <Navbar />
        {renderModule()}
      </main>
    </div>
  );
}