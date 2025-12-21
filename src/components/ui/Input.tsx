import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2 ml-1 font-display tracking-tight">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-gray-50/50 dark:bg-dark-bg/50 
            border border-gray-200 dark:border-dark-border 
            rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
            dark:text-dark-text transition-all duration-300 outline-none
            font-display tracking-tight placeholder:text-gray-400
            ${icon ? "pl-11 pr-4 py-3" : "px-4 py-3"}
            ${error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""} 
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 ml-1 text-xs font-medium text-red-500 dark:text-red-400 font-display">
          {error}
        </p>
      )}
    </div>
  );
}
