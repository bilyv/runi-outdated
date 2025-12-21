import { useState } from "react";
import { LogOut, LayoutDashboard, ShoppingCart, User, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface StaffDashboardProps {
    staffUser: any;
    onLogout: () => void;
}

export function StaffDashboard({ staffUser, onLogout }: StaffDashboardProps) {
    const [activeTab, setActiveTab] = useState("pos");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white transition-colors duration-200">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 h-16">
                <div className="h-full px-6 flex items-center justify-between max-w-[1920px] mx-auto">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
                            Runi <span className="text-blue-500">Staff</span>
                        </span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 dark:text-white font-display leading-tight">{staffUser.staff_full_name}</p>
                                <p className="text-xs text-blue-500 font-medium">Staff Member</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden border-2 border-blue-500/20">
                                {staffUser.id_card_front_url ? (
                                    <img src={staffUser.id_card_front_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                )}
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-100 dark:bg-white/5 rounded-xl ml-2"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="pt-24 px-6 pb-12 max-w-[1920px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Quick Stats or Welcome Message */}
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5 col-span-full">
                        <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-2">
                            Welcome back, {staffUser.staff_full_name.split(' ')[0]}!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Ready to process sales for today?
                        </p>
                    </div>
                </div>

                {/* Placeholder for POS / Sales functionality */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5 min-h-[500px] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                        <ShoppingCart className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Point of Sale Terminal</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        This area will contain the sales interface for staff members to process transactions.
                    </p>
                </div>
            </main>
        </div>
    );
}
