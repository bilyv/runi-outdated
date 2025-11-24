import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Save, Settings as SettingsIcon, Bell, Shield, Palette, Globe, Database, Mail } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { toast } from "sonner";

export function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  
  const settings = useQuery(api.settings.getAll, {});
  const updateSetting = useMutation(api.settings.update);

  const [generalSettings, setGeneralSettings] = useState({
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    currency: "USD",
    timezone: "UTC",
    taxRate: 10,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    salesNotifications: true,
    expenseAlerts: true,
    dailyReports: false,
    weeklyReports: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
  });

  const handleSaveGeneral = async () => {
    try {
      for (const [key, value] of Object.entries(generalSettings)) {
        await updateSetting({
          key,
          value: value.toString(),
          category: "general"
        });
      }
      toast.success("General settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const handleSaveNotifications = async () => {
    try {
      for (const [key, value] of Object.entries(notificationSettings)) {
        await updateSetting({
          key,
          value: value.toString(),
          category: "notifications"
        });
      }
      toast.success("Notification settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const handleSaveSecurity = async () => {
    try {
      for (const [key, value] of Object.entries(securitySettings)) {
        await updateSetting({
          key,
          value: value.toString(),
          category: "security"
        });
      }
      toast.success("Security settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "integrations", label: "Integrations", icon: Globe },
    { id: "backup", label: "Backup & Data", icon: Database },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-lg border border-gray-200 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Business Name"
                    value={generalSettings.businessName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, businessName: e.target.value })}
                  />
                  <Input
                    label="Business Email"
                    type="email"
                    value={generalSettings.businessEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, businessEmail: e.target.value })}
                  />
                  <Input
                    label="Business Phone"
                    value={generalSettings.businessPhone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, businessPhone: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                  <Input
                    label="Tax Rate (%)"
                    type="number"
                    value={generalSettings.taxRate}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, taxRate: parseFloat(e.target.value) || 0 })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                  <textarea
                    value={generalSettings.businessAddress}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, businessAddress: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button onClick={handleSaveGeneral} variant="primary" className="flex items-center gap-2">
                  <Save size={16} />
                  Save General Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Low Stock Alerts</h3>
                      <p className="text-sm text-gray-600">Get notified when products are running low</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.lowStockAlerts}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Sales Notifications</h3>
                      <p className="text-sm text-gray-600">Get notified about new sales</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.salesNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, salesNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Weekly Reports</h3>
                      <p className="text-sm text-gray-600">Receive weekly business reports</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyReports}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <Button onClick={handleSaveNotifications} variant="primary" className="flex items-center gap-2">
                  <Save size={16} />
                  Save Notification Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Session Timeout (minutes)"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) || 30 })}
                    />
                    <Input
                      label="Password Expiry (days)"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) || 90 })}
                    />
                    <Input
                      label="Max Login Attempts"
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSecurity} variant="primary" className="flex items-center gap-2">
                  <Save size={16} />
                  Save Security Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 border-2 border-blue-500 rounded-lg bg-white">
                        <div className="w-full h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Light (Current)</p>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-lg bg-white opacity-50">
                        <div className="w-full h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Dark (Coming Soon)</p>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-lg bg-white opacity-50">
                        <div className="w-full h-20 bg-gradient-to-br from-blue-800 to-purple-800 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Auto (Coming Soon)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Color Scheme</h3>
                    <div className="grid grid-cols-6 gap-3">
                      {["blue", "purple", "green", "red", "orange", "pink"].map((color) => (
                        <div key={color} className="text-center">
                          <div className={`w-12 h-12 rounded-full bg-${color}-500 mx-auto mb-2 cursor-pointer border-2 ${color === "blue" ? "border-gray-800" : "border-gray-200"}`}></div>
                          <p className="text-xs capitalize">{color}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h2>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="text-blue-600" size={24} />
                        <div>
                          <h3 className="font-medium text-gray-900">Email Service</h3>
                          <p className="text-sm text-gray-600">Connect your email service for notifications</p>
                        </div>
                      </div>
                      <Button variant="secondary">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="text-green-600" size={24} />
                        <div>
                          <h3 className="font-medium text-gray-900">Payment Gateway</h3>
                          <p className="text-sm text-gray-600">Connect payment processors (Coming Soon)</p>
                        </div>
                      </div>
                      <Button variant="secondary" disabled>Coming Soon</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="text-purple-600" size={24} />
                        <div>
                          <h3 className="font-medium text-gray-900">Accounting Software</h3>
                          <p className="text-sm text-gray-600">Sync with QuickBooks, Xero, etc. (Coming Soon)</p>
                        </div>
                      </div>
                      <Button variant="secondary" disabled>Coming Soon</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "backup" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Backup & Data Management</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Automatic Backups</h3>
                    <p className="text-sm text-blue-700 mb-4">Your data is automatically backed up daily to secure cloud storage.</p>
                    <div className="flex gap-3">
                      <Button variant="secondary">Download Backup</Button>
                      <Button variant="secondary">Restore Data</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Data Export</h3>
                    <p className="text-sm text-gray-600 mb-4">Export your business data in various formats.</p>
                    <div className="flex gap-3">
                      <Button variant="secondary">Export as CSV</Button>
                      <Button variant="secondary">Export as JSON</Button>
                      <Button variant="secondary">Export as PDF</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-700 mb-4">Permanently delete all your data. This action cannot be undone.</p>
                    <Button variant="secondary" className="text-red-600 border-red-300 hover:bg-red-50">
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
