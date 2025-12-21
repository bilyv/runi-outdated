import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export function StaffPOS() {
    return (
        <div className="pt-6 pb-12 max-w-[1920px] mx-auto min-h-screen">
            <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-white/5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                    <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-2">
                        Point of Sale
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-sans text-lg">
                        Process sales and manage orders.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-12 shadow-sm border border-gray-100 dark:border-white/5 min-h-[500px] flex flex-col items-center justify-center text-center group">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <ShoppingCart className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-display tracking-tight">Point of Sale Terminal</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md font-sans text-lg leading-relaxed">
                    This interactive area will soon host the sales terminal where you can browse products, add items to cart, and process customer payments.
                </p>
                <button className="mt-8 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold font-display shadow-lg hover:translate-y-[-2px] transition-all">
                    Initialize Terminal
                </button>
            </div>
        </div>
    );
}
