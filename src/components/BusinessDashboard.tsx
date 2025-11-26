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

export function BusinessDashboard() {
  const [activeModule, setActiveModule] = useState<ModuleType>("dashboard");

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
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className="flex-1 overflow-auto">
        <Navbar />
        {renderModule()}
      </main>
    </div>
  );
}
