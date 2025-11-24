import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getStats = query({
  args: {
    period: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = new Date();
    let startDate: Date;

    switch (args.period) {
      case "daily":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "weekly":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    // Get sales data
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_creation_time", (q) => q.gte("_creationTime", startDate.getTime()))
      .collect();

    // Get expenses data
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_creation_time", (q) => q.gte("_creationTime", startDate.getTime()))
      .collect();

    // Get low stock products
    const products = await ctx.db.query("products").collect();
    const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.isActive);

    // Calculate totals
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amountPaid, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalProfit = totalRevenue - totalExpenses;

    // Calculate cost of goods sold
    const totalCostOfGoods = sales.reduce((sum, sale) => {
      return sum + sale.items.reduce((itemSum, item) => {
        // This is a simplified calculation - in reality you'd need to track actual cost per item
        return itemSum + (item.total * 0.6); // Assuming 60% cost ratio
      }, 0);
    }, 0);

    const actualProfit = totalRevenue - totalCostOfGoods - totalExpenses;

    return {
      totalSales,
      totalRevenue,
      totalExpenses,
      totalProfit: actualProfit,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5), // Top 5 low stock items
      recentSales: sales.slice(0, 5), // 5 most recent sales
    };
  },
});
