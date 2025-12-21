import { useState, useEffect } from "react";
import { Sidebar, MenuGroup } from "../../components/layout/Sidebar";
import { Navbar } from "../../components/layout/Navbar";
import { StaffPOS } from "./StaffPOS";
import { StaffSettings } from "../settings/StaffSettings";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart3, Settings as SettingsIcon, Menu, ShoppingCart } from "lucide-react";

interface StaffDashboardLayoutProps {
    staffUser: any;
    onLogout: () => void;
}

export type StaffModuleType = "dashboard" | "settings";

export function StaffDashboardLayout({ staffUser, onLogout }: StaffDashboardLayoutProps) {
    const [activeModule, setActiveModule] = useState<StaffModuleType>("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { module } = useParams<{ module: string }>();

    // Staff Menu Configuration
    const staffMenuGroups: MenuGroup[] = [
        {
            label: "Main",
            items: [
                { id: "dashboard", label: "Dashboard", icon: ShoppingCart },
                { id: "settings", label: "Settings", icon: SettingsIcon },
            ]
        }
    ];

    // Set active module based on URL parameter
    useEffect(() => {
        if (module && isValidModule(module)) {
            setActiveModule(module as StaffModuleType);
        } else {
            // Default to dashboard if no valid module is specified or on root /staff/dashboard
            if (module === undefined) {
                // If we are at /staff/dashboard (layout mounted), activeModule is dashboard
            } else {
                setActiveModule("dashboard");
                navigate("/staff/dashboard", { replace: true });
            }
        }
    }, [module, navigate]);

    const isValidModule = (module: string): module is StaffModuleType => {
        return ["dashboard", "settings"].includes(module);
    };

    const renderModule = () => {
        switch (activeModule) {
            case "dashboard":
                return <StaffPOS />;
            case "settings":
                return <StaffSettings staffUser={staffUser} />;
            default:
                return <StaffPOS />;
        }
    };

    // Bottom navigation items for mobile
    const bottomNavItems = [
        { id: "dashboard", label: "Dashboard", icon: ShoppingCart },
        { id: "settings", label: "Settings", icon: SettingsIcon },
    ];

    // Adapter for staff user to navbar user format if needed, but Navbar handles any object with fullName/name
    const navbarUser = {
        fullName: staffUser?.staff_full_name,
        name: staffUser?.staff_full_name,
        email: staffUser?.email,
        ...staffUser
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:static fixed inset-y-0 left-0 z-30`}>
                <Sidebar
                    activeModule={activeModule}
                    onModuleChange={(module) => {
                        setActiveModule(module as StaffModuleType);
                        navigate(`/staff/${module}`);
                        if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    menuGroups={staffMenuGroups}
                />
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main content */}
            <main className="flex-1 flex flex-col overflow-auto md:ml-0">
                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                    user={navbarUser}
                    onLogout={onLogout}
                />
                <div className="flex-1 overflow-auto p-4 md:p-6">
                    {renderModule()}
                </div>

                {/* Bottom Navigation for mobile */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border z-10">
                    <div className="flex justify-around items-center py-2">
                        {bottomNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeModule === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveModule(item.id as StaffModuleType);
                                        navigate(`/staff/${item.id}`);
                                    }}
                                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg ${isActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-400"
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="text-xs font-sans font-medium mt-1">{item.label}</span>

                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Add padding to content to prevent overlap with bottom nav */}
                <div className="md:hidden h-16"></div>
            </main>
        </div>
    );
}
