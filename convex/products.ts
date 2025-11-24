import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let products;
    
    if (args.category) {
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    } else {
      products = await ctx.db.query("products").collect();
    }
    
    if (args.search) {
      return products.filter(p => 
        p.name.toLowerCase().includes(args.search!.toLowerCase()) ||
        p.sku.toLowerCase().includes(args.search!.toLowerCase())
      );
    }
    
    return products;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    sku: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    costPrice: v.number(),
    sellingPrice: v.number(),
    stock: v.number(),
    minStock: v.number(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("products", {
      ...args,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    sku: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    costPrice: v.optional(v.number()),
    sellingPrice: v.optional(v.number()),
    stock: v.optional(v.number()),
    minStock: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const adjustStock = mutation({
  args: {
    id: v.id("products"),
    adjustment: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");

    const newStock = Math.max(0, product.stock + args.adjustment);
    return await ctx.db.patch(args.id, { stock: newStock });
  },
});

export const getLowStock = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const products = await ctx.db.query("products").collect();
    return products.filter(p => p.stock <= p.minStock && p.isActive);
  },
});
