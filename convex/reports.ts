import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSalesReport = query({
    args: {
        startDate: v.number(),
        endDate: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const sales = await ctx.db
            .query("sales")
            .withIndex("by_user", (q) => q.eq("user_id", userId))
            .collect();

        // Filter by date range manually as we don't have a reliable date index in schema for sales yet
        // In a production app, we'd add an index on updated_at
        const filteredSales = sales.filter(s => s.updated_at >= args.startDate && s.updated_at <= args.endDate);

        const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total_amount, 0);
        const totalPaid = filteredSales.reduce((sum, s) => sum + s.amount_paid, 0);
        const totalRemaining = filteredSales.reduce((sum, s) => sum + s.remaining_amount, 0);

        return {
            sales: filteredSales,
            totals: {
                revenue: totalRevenue,
                paid: totalPaid,
                remaining: totalRemaining,
                count: filteredSales.length,
            }
        };
    },
});

export const getInventoryReport = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const products = await ctx.db
            .query("products")
            .withIndex("by_user", (q) => q.eq("user_id", userId))
            .collect();

        const categories = await ctx.db
            .query("productcategory")
            .withIndex("by_user", (q) => q.eq("user_id", userId))
            .collect();

        const categoryMap = new Map(categories.map(c => [c._id, c.category_name]));

        const totalValue = products.reduce((sum, p) => sum + (p.quantity_box * p.cost_per_box + p.quantity_kg * p.cost_per_kg), 0);
        const totalPotentialRevenue = products.reduce((sum, p) => sum + (p.quantity_box * p.price_per_box + p.quantity_kg * p.price_per_kg), 0);

        const productsWithCategory = products.map(p => ({
            ...p,
            categoryName: categoryMap.get(p.category_id) || "Uncategorized"
        }));

        return {
            products: productsWithCategory,
            totals: {
                value: totalValue,
                potentialRevenue: totalPotentialRevenue,
                potentialProfit: totalPotentialRevenue - totalValue,
                count: products.length,
            }
        };
    },
});

export const getExpenseReport = query({
    args: {
        startDate: v.number(),
        endDate: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const expenses = await ctx.db
            .query("expenses")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const categories = await ctx.db
            .query("expensecategory")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const categoryMap = new Map(categories.map(c => [c._id, c.name]));

        const filteredExpenses = expenses.filter(e => e.date >= args.startDate && e.date <= args.endDate);

        const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

        const expensesWithCategory = filteredExpenses.map(e => ({
            ...e,
            categoryName: categoryMap.get(e.categoryId) || "Uncategorized"
        }));

        return {
            expenses: expensesWithCategory,
            totals: {
                amount: totalAmount,
                count: filteredExpenses.length,
            }
        };
    },
});
