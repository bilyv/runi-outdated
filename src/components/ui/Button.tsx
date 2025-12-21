import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger";
    size?: "sm" | "md" | "lg";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}

export function Button({
    children,
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    onClick,
    className = ""
}: ButtonProps) {
    const baseClasses = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-display tracking-tight active:scale-95";

    const variantClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800",
        secondary: "bg-gray-100/80 text-gray-700 border border-gray-200/50 hover:bg-gray-200/80 focus:ring-gray-300 dark:bg-dark-card dark:text-dark-text dark:border-dark-border dark:hover:bg-dark-card/80 backdrop-blur-sm",
        danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700",
    };

    const sizeClasses = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base",
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {children}
        </button>
    );
}
