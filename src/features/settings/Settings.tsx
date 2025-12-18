import { UserProfile } from "./UserProfile";
import { ThemeSettings } from "./ThemeSettings";

export function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Account Settings</h1>
      </div>
      
      <div className="space-y-6">
        {/* Profile Section */}
        <UserProfile />
        
        {/* Theme Settings Section */}
        <ThemeSettings />
      </div>
    </div>
  );
}
