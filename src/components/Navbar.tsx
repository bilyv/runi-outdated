import { UserCircle, Bell, Search } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="h-16 px-6 flex items-center justify-between bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-card border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-dark-bg transition-all outline-none text-gray-900 dark:text-dark-text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleTheme}
                    className="p-2 text-gray-500 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-card rounded-full transition-colors"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 text-gray-500 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-card rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 dark:bg-dark-border mx-2"></div>

                <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-100 dark:hover:bg-dark-card rounded-full transition-all">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-dark-card text-blue-600 dark:text-dark-text rounded-full flex items-center justify-center">
                        <UserCircle size={20} />
                    </div>
                    <div className="text-sm text-left hidden sm:block">
                        <p className="font-medium text-gray-700 dark:text-dark-text">John Doe</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                    </div>
                </button>
            </div>
        </div>
    );
}