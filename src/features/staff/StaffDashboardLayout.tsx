import { useState, useEffect, useMemo } from "react";
import { Sidebar, MenuGroup } from "../../components/layout/Sidebar";
import { Navbar } from "../../components/layout/Navbar";
import { StaffPOS } from "./StaffPOS";
import { StaffSettings } from "../settings/StaffSettings";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart3, Settings as SettingsIcon, Menu, ShoppingCart, Package, Receipt, Shovel as ShieldAlert } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "../../lib/utils";

interface StaffDashboardLayoutProps {
    staffUser: any;
    staffToken: string | null;
    onLogout: () => void;
}

export type StaffModuleType = "dashboard" | "products" | "sales" | "cash-tracking" | "settings";

function RestrictedView() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Limited</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                You have permission to view this module, but specific access to its sub-components hasn't been granted yet.
            </p>
            <div className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-500/20">
                Please contact the administrator
            </div>
        </div>
    );
}

export function StaffDashboardLayout({ staffUser, staffToken, onLogout }: StaffDashboardLayoutProps) {
    const [activeModule, setActiveModule] = useState<StaffModuleType>("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { module } = useParams<{ module: string }>();

    const staffPermissions = useQuery(api.staff.getStaffPermissionsByToken, staffToken ? { token: staffToken } : "skip");

    const permissionsMap = useMemo(() => {
        const map: Record<string, boolean> = {};
        staffPermissions?.forEach(p => {
            map[p.permission_key] = p.is_enabled;
        });
        return map;
    }, [staffPermissions]);

    // Staff Menu Configuration
    const staffMenuGroups = useMemo<MenuGroup[]>(() => {
        const groups: MenuGroup[] = [
            {
                label: "Main",
                items: [
                    { id: "dashboard", label: "Dashboard", icon: ShoppingCart },
                ]
            }
        ];

        if (permissionsMap["main_product"]) {
            groups[0].items.push({ id: "products", label: "Products", icon: Package });
        }
        if (permissionsMap["main_sales"]) {
            groups[0].items.push({ id: "sales", label: "Sales", icon: ShoppingCart });
        }
        if (permissionsMap["main_cash-tracking"]) {
            groups[0].items.push({ id: "cash-tracking", label: "Cash Tracking", icon: BarChart3 });
        }

        groups.push({
            label: "System",
            items: [
                { id: "settings", label: "Settings", icon: SettingsIcon },
            ]
        });

        return groups;
    }, [permissionsMap]);

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
                navigate("/staff-portal/dashboard", { replace: true });
            }
        }
    }, [module, navigate]);

    const isValidModule = (module: string): module is StaffModuleType => {
        return ["dashboard", "products", "sales", "cash-tracking", "settings"].includes(module);
    };

    const renderModule = () => {
        switch (activeModule) {
            case "dashboard":
                return <StaffPOS />;
            case "settings":
                return <StaffSettings staffUser={staffUser} />;
            case "products":
            case "sales":
            case "cash-tracking":
                return <RestrictedView />;
            default:
                return <StaffPOS />;
        }
    };

    // Bottom navigation items for mobile
    const bottomNavItems = useMemo(() => {
        const items = [
            { id: "dashboard", label: "Dashboard", icon: ShoppingCart },
        ];

        if (permissionsMap["main_product"]) items.push({ id: "products", label: "Products", icon: Package });
        if (permissionsMap["main_sales"]) items.push({ id: "sales", label: "Sales", icon: ShoppingCart });

        items.push({ id: "settings", label: "Settings", icon: SettingsIcon });
        return items;
    }, [permissionsMap]);

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
                        navigate(`/staff-portal/${module}`);
                        if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    menuGroups={staffMenuGroups}
                    user={staffUser}
                    onLogout={onLogout}
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
                        {bottomNavItems.map((item: any) => {
                            const Icon = item.icon;
                            const isActive = activeModule === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveModule(item.id as StaffModuleType);
                                        navigate(`/staff-portal/${item.id}`);
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
