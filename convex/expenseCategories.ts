import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new expense category
export const create = mutation({
    args: {
        name: v.string(),
        budget: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        // Check if category already exists for this user
        const existing = await ctx.db
            .query("expensecategory")
            .withIndex("by_user", (q) =>
                q.eq("userId", userId)
            )
            .filter((q) => q.eq(q.field("name"), args.name))
            .first();

        if (existing) {
            throw new Error("Category already exists");
        }

        const now = Date.now();
        const categoryId = await ctx.db.insert("expensecategory", {
            userId: userId,
            name: args.name,
            budget: args.budget,
            updatedAt: now,
        });

        return categoryId;
    },
});

// List all expense categories for the current user
export const list = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        const categories = await ctx.db
            .query("expensecategory")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        return categories;
    },
});

// Get a specific expense category
export const get = query({
    args: {
        id: v.id("expensecategory"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const category = await ctx.db.get(args.id);
        if (!category) {
            throw new Error("Category not found");
        }

        if (category.userId !== userId) {
            throw new Error("Unauthorized");
        }

        return category;
    },
});

// Update an expense category
export const update = mutation({
    args: {
        id: v.id("expensecategory"),
        name: v.string(),
        budget: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const category = await ctx.db.get(args.id);
        if (!category) {
            throw new Error("Category not found");
        }

        if (category.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const now = Date.now();
        await ctx.db.patch(args.id, {
            name: args.name,
            budget: args.budget,
            updatedAt: now,
        });

        return args.id;
    },
});

// Delete an expense category
export const remove = mutation({
    args: {
        id: v.id("expensecategory"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const category = await ctx.db.get(args.id);
        if (!category) {
            throw new Error("Category not found");
        }

        if (category.userId !== userId) {
            throw new Error("Unauthorized");
        }

        // Check if there are any expenses in this category
        const expenses = await ctx.db
            .query("expenses")
            .withIndex("by_category", (q) => q.eq("categoryId", args.id))
            .first();

        if (expenses) {
            throw new Error("Cannot delete category with existing expenses");
        }

        await ctx.db.delete(args.id);
        return args.id;
    },
});