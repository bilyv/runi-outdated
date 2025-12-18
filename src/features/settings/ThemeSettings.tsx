import { useTheme } from "../../components/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
    { id: "system", name: "System", icon: Monitor },
  ];

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Theme Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Customize the appearance of the application
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.id;
            
            return (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`} />
                <span className={`text-sm font-medium ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                  {themeOption.name}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
          <h3 className="text-sm font-medium text-gray-900 dark:text-dark-text mb-3">Preview</h3>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}