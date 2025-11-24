import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Receipt,
  AlertTriangle,
  Plus,
  Package
} from "lucide-react";
import { StatCard } from "../ui/StatCard";
import { Button } from "../ui/Button";

export function Dashboard() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const stats = useQuery(api.dashboard.getStats, { period });

  if (!stats) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Sales Sold"
          value={stats.totalSales.toString()}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Profit"
          value={`$${stats.totalProfit.toFixed(2)}`}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Expenses"
          value={`$${stats.totalExpenses.toFixed(2)}`}
          icon={Receipt}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={16} />
            Add Sale
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Package size={16} />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        {stats.lowStockCount > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-amber-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Stock Alerts</h2>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                {stats.lowStockCount}
              </span>
            </div>
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div key={product._id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-amber-700">
                      {product.stock} left
                    </p>
                    <p className="text-xs text-gray-500">
                      Min: {product.minStock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Sales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
          <div className="space-y-3">
            {stats.recentSales.map((sale) => (
              <div key={sale._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{sale.customerName}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(sale._creationTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${sale.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sale.status === "completed" 
                      ? "bg-green-100 text-green-800"
                      : sale.status === "partial"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
