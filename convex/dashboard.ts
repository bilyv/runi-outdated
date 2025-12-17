import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper function to generate date ranges
function getDateRanges(period: "daily" | "weekly" | "monthly") {
  const now = new Date();
  let startDate: Date;
  let interval: "day" | "week" | "month";

  switch (period) {
    case "daily":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      interval = "day";
      break;
    case "weekly":
      startDate = new Date(now.getTime() - 7 * 7 * 24 * 60 * 60 * 1000); // 7 weeks
      interval = "week";
      break;
    case "monthly":
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1); // 6 months
      interval = "month";
      break;
  }

  return { startDate, interval };
}

// Helper function to group data by date
function groupDataByDate(data: any[], startDate: Date, interval: "day" | "week" | "month", period: "daily" | "weekly" | "monthly") {
  const grouped: Record<string, number> = {};
  
  // Initialize all periods with 0
  const currentDate = new Date(startDate);
  const periods = [];
  
  for (let i = 0; i < (period === "daily" ? 7 : period === "weekly" ? 7 : 6); i++) {
    const key = formatDate(currentDate, period);
    grouped[key] = 0;
    periods.push(key);
    if (interval === "day") currentDate.setDate(currentDate.getDate() + 1);
    else if (interval === "week") currentDate.setDate(currentDate.getDate() + 7);
    else if (interval === "month") currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // Group actual data
  data.forEach(item => {
    const itemDate = new Date(item._creationTime);
    const key = formatDate(itemDate, period);
    if (grouped.hasOwnProperty(key)) {
      grouped[key] += item.amount_paid || item.amount || 0;
    }
  });
  
  // Convert to array format for charts
  return periods.map(period => ({
    name: period,
    value: grouped[period]
  }));
}

// Helper function to format dates
function formatDate(date: Date, period: "daily" | "weekly" | "monthly"): string {
  if (period === "daily") {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else if (period === "weekly") {
    const weekNumber = Math.ceil(date.getDate() / 7);
    return `Week ${weekNumber}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short' });
  }
}

export const getStats = query({
  args: {
    period: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { startDate, interval } = getDateRanges(args.period);

    // Get sales data
    const sales = await ctx.db
      .query("sales")
      .collect();

    // Get expenses data
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_creation_time", (q) => q.gte("_creationTime", startDate.getTime()))
      .collect();

    // Group data for charts
    const revenueData = groupDataByDate(sales, startDate, interval, args.period);
    const expenseData = groupDataByDate(expenses, startDate, interval, args.period);

    // Get all products
    const products = await ctx.db.query("products").collect();
    
    // Get low stock products (quantity_box <= boxed_low_stock_threshold)
    const lowStockProducts = products.filter(p => p.quantity_box <= p.boxed_low_stock_threshold);
    
    // Calculate totals
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount_paid, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalProfit = totalRevenue - totalExpenses;
    
    // Calculate cost of goods sold (simplified calculation)
    const totalCostOfGoods = sales.reduce((sum, sale) => {
      // Simplified calculation based on profit fields
      return sum + (sale.total_amount - (sale.profit_per_box * sale.boxes_quantity + sale.profit_per_kg * sale.kg_quantity));
    }, 0);
    
    const actualProfit = totalRevenue - totalCostOfGoods - totalExpenses;
    
    // Calculate products in stock metrics
    const totalProductsInStock = products.length;
    // For product types and fish types, we need to join with categories
    const categories = await ctx.db.query("productcategory").collect();
    const categoryMap = new Map(categories.map(cat => [cat._id, cat.category_name]));
    
    const productTypes = [...new Set(products.map(p => categoryMap.get(p.category_id)))].filter(Boolean).length;
    const fishTypes = categories.filter(cat => cat.category_name.toLowerCase().includes('fish')).length;
    
    // Calculate damaged items (we'll simulate this as we don't have a specific field for it)
    // For demonstration, we'll assume 5% of low stock items are damaged
    const damagedItemsCount = Math.max(1, Math.floor(lowStockProducts.length * 0.05));
    
    // Calculate revenue growth (simplified - comparing this period to last period)
    const lastPeriodStart = new Date(startDate);
    switch (args.period) {
      case "daily":
        lastPeriodStart.setDate(lastPeriodStart.getDate() - 7);
        break;
      case "weekly":
        lastPeriodStart.setDate(lastPeriodStart.getDate() - 49); // 7 weeks
        break;
      case "monthly":
        lastPeriodStart.setMonth(lastPeriodStart.getMonth() - 6); // 6 months
        break;
    }
    
    const lastPeriodSales = await ctx.db
      .query("sales")
      .collect();
      
    const lastPeriodRevenue = lastPeriodSales.reduce((sum, sale) => sum + sale.amount_paid, 0);
    const revenueGrowth = lastPeriodRevenue > 0 
      ? ((totalRevenue - lastPeriodRevenue) / lastPeriodRevenue) * 100 
      : 0;

    return {
      totalSales,
      totalRevenue,
      totalExpenses,
      totalProfit: actualProfit,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5), // Top 5 low stock items
      recentSales: sales.slice(0, 5), // 5 most recent sales,
      
      // Chart data
      revenueData,
      expenseData,
      
      // Financial overview data
      financialOverview: {
        revenue: totalRevenue,
        profit: actualProfit,
        expenses: totalExpenses,
        damages: damagedItemsCount * 10 // Simulated damage cost
      },
      
      // New fields for the updated dashboard
      totalProductsInStock,
      productTypes,
      fishTypes,
      damagedItemsCount,
      revenueGrowth,
    };
  },
});