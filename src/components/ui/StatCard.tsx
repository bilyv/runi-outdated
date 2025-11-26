import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "red";
}

const colorClasses = {
  blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  green: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  red: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-dark-text mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
