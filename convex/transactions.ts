import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all transactions
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("user_id", userId))
      .order("desc")
      .collect();

    return transactions;
  },
});

// Get transactions by payment status
export const listByPaymentStatus = query({
  args: {
    payment_status: v.union(v.literal("pending"), v.literal("partial"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_payment_status", (q) => q.eq("payment_status", args.payment_status))
      .order("desc")
      .collect();

    return transactions;
  },
});

// Create a new transaction
export const create = mutation({
  args: {
    transaction_id: v.string(),
    sales_id: v.id("sales"),
    user_id: v.id("users"),
    product_name: v.string(),
    client_name: v.string(),
    boxes_quantity: v.number(),
    kg_quantity: v.number(),
    total_amount: v.number(),
    payment_status: v.union(v.literal("pending"), v.literal("partial"), v.literal("completed")),
    payment_method: v.string(),
    updated_by: v.id("users"),
    updated_at: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("transactions", {
      ...args,
    });
  },
});

// Update a transaction
export const update = mutation({
  args: {
    transaction_id: v.string(),
    sales_id: v.id("sales"),
    user_id: v.id("users"),
    product_name: v.string(),
    client_name: v.string(),
    boxes_quantity: v.number(),
    kg_quantity: v.number(),
    total_amount: v.number(),
    payment_status: v.union(v.literal("pending"), v.literal("partial"), v.literal("completed")),
    payment_method: v.string(),
    updated_by: v.id("users"),
    updated_at: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the transaction by transaction_id
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("transaction_id"), args.transaction_id))
      .collect();

    if (transactions.length === 0) {
      throw new Error("Transaction not found");
    }

    const transactionId = transactions[0]._id;

    return await ctx.db.replace(transactionId, {
      ...args,
    });
  },
});

// Delete a transaction
export const remove = mutation({
  args: { transaction_id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the transaction by transaction_id
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("transaction_id"), args.transaction_id))
      .collect();

    if (transactions.length === 0) {
      throw new Error("Transaction not found");
    }

    const transactionId = transactions[0]._id;

    await ctx.db.delete(transactionId);
    return transactionId;
  },
});