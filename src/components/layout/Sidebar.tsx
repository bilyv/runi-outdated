import {
  Package,
  ShoppingCart,
  Receipt,
  FileText,
  TrendingUp,
  UserCheck,
  Settings as SettingsIcon,
  Banknote,
  LayoutGrid
} from "lucide-react";
import { ModuleType } from "./BusinessDashboard";
import { SignOutButton } from "../../features/auth/SignOutButton";

interface SidebarProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

const menuGroups = [
  {
    label: "Main",
    items: [
      { id: "dashboard" as const, label: "Dashboard", icon: LayoutGrid },
      { id: "products" as const, label: "Products", icon: Package },
      { id: "sales" as const, label: "Sales", icon: ShoppingCart },
    ]
  },
  {
    label: "Finance",
    items: [
      { id: "transactions" as const, label: "Transactions", icon: Banknote },
      { id: "expenses" as const, label: "Expenses", icon: Receipt },
    ]
  },
  {
    label: "Resources",
    items: [
      { id: "documents" as const, label: "Documents", icon: FileText },
      { id: "reports" as const, label: "Reports", icon: TrendingUp },
    ]
  },
  {
    label: "System",
    items: [
      { id: "users" as const, label: "Users", icon: UserCheck },
      { id: "settings" as const, label: "Settings", icon: SettingsIcon },
    ]
  }
];

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-[#1a1a1a] border-r border-gray-100 dark:border-white/5 flex flex-col h-full shadow-sm">
      <div className="p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <img src="/logo.svg" alt="Runi Logo" className="w-5 h-5 invert brightness-0" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Runi</h1>
        </div>
      </div>

      <nav className="flex-1 px-3 pb-2 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, groupIdx) => (
          <div key={group.label} className={groupIdx > 0 ? "mt-4" : ""}>
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1.5">
              {group.label}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;

                  return (
                    <button
                      key={module.id}
                      onClick={() => onModuleChange(module.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-xl -z-10 animate-in fade-in zoom-in duration-300" />
                      )}
                      
                      <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? "bg-blue-100 dark:bg-blue-500/20 shadow-sm" 
                          : "bg-transparent group-hover:bg-gray-100 dark:group-hover:bg-white/5"
                      }`}>
                        <Icon
                          size={18}
                          strokeWidth={isActive ? 2.5 : 2}
                          className={`transition-all duration-300 ${
                            isActive 
                              ? "scale-110 rotate-3" 
                              : "group-hover:scale-110 group-hover:rotate-3"
                          }`}
                        />
                      </div>

                      <span className={`text-sm font-semibold tracking-tight transition-all duration-300 ${
                        isActive ? "translate-x-0.5" : "group-hover:translate-x-0.5"
                      }`}>
                        {module.label}
                      </span>

                      {isActive && (
                        <div className="absolute right-2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
                      )}
                    </button>
                  );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 mt-auto">
        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-2.5 border border-gray-100 dark:border-white/5 transition-all hover:border-gray-200 dark:hover:border-white/10 group">
          <SignOutButton />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}} />
    </div>
  );
}
