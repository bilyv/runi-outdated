import { ThemeToggle } from "@/components/ThemeToggle"; // We can keep the toggle or just a placeholder

export function StaffDashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111] transition-colors duration-200">
            {/* Top Navigation Bar Skeleton */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 h-16">
                <div className="h-full px-6 flex items-center justify-between max-w-[1920px] mx-auto">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
                        <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse" /> {/* Theme Toggle placeholder */}

                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block space-y-1">
                                <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                                <div className="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse ml-auto" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse border-2 border-transparent" />
                        </div>

                        <div className="w-9 h-9 bg-gray-200 dark:bg-white/10 rounded-xl ml-2 animate-pulse" /> {/* Logout placeholder */}
                    </div>
                </div>
            </nav>

            {/* Main Content Area Skeleton */}
            <main className="pt-24 px-6 pb-12 max-w-[1920px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Welcome Message Skeleton */}
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5 col-span-full">
                        <div className="h-8 w-64 bg-gray-200 dark:bg-white/10 rounded mb-4 animate-pulse" />
                        <div className="h-4 w-48 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                    </div>
                </div>

                {/* POS Placeholder Skeleton */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5 min-h-[500px] flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-white/10 rounded-full mb-6 animate-pulse" />
                    <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded mb-3 animate-pulse" />
                    <div className="h-4 w-80 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                </div>
            </main>
        </div>
    );
}
