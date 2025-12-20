import React from "react";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  title?: string;
  count?: number;
}

export function Table({ headers, children, title, count }: TableProps) {
  return (
    <div className="bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/40 dark:border-white/10 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {title && (
        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
            {title}
            {count !== undefined && (
              <span className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                ({count})
              </span>
            )}
          </h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-white/5">
          <thead className="bg-gray-50/50 dark:bg-white/5">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-bold font-display text-gray-400 dark:text-gray-500 uppercase tracking-widest"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TableRow({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr 
      onClick={onClick}
      className={`group transition-colors duration-200 ${onClick ? 'cursor-pointer hover:bg-blue-50/30 dark:hover:bg-blue-500/5' : 'hover:bg-gray-50/50 dark:hover:bg-white/5'}`}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "", primary = false }: { children: React.ReactNode; className?: string; primary?: boolean }) {
  return (
    <td className={`px-8 py-4 whitespace-nowrap text-sm ${primary ? 'font-bold text-gray-900 dark:text-white font-display' : 'font-medium text-gray-600 dark:text-gray-400 font-sans'} ${className}`}>
      {children}
    </td>
  );
}
