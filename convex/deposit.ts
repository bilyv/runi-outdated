import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new deposit
export const create = mutation({
  args: {
    deposit_id: v.string(),
    deposit_type: v.string(),
    account_name: v.string(),
    account_number: v.string(),
    amount: v.number(),
    to_recipient: v.string(),
    deposit_image_url: v.string(),
    approval: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("deposit", {
      ...args,
      user_id: userId,
      created_by: userId,
      updated_by: userId,
      updated_at: Date.now(),
    });
  },
});

// Get all deposits for a user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const deposits = await ctx.db
      .query("deposit")
      .withIndex("by_user_id", (q) => q.eq("user_id", userId))
      .order("desc")
      .collect();

    return deposits;
  },
});

// Get deposit by ID
export const getById = query({
  args: { deposit_id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const deposits = await ctx.db
      .query("deposit")
      .withIndex("by_deposit_id", (q) => q.eq("deposit_id", args.deposit_id))
      .collect();

    if (deposits.length === 0) {
      throw new Error("Deposit not found");
    }

    return deposits[0];
  },
});

// Update a deposit
export const update = mutation({
  args: {
    deposit_id: v.string(),
    deposit_type: v.string(),
    account_name: v.string(),
    account_number: v.string(),
    amount: v.number(),
    to_recipient: v.string(),
    deposit_image_url: v.string(),
    approval: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the deposit by deposit_id
    const deposits = await ctx.db
      .query("deposit")
      .withIndex("by_deposit_id", (q) => q.eq("deposit_id", args.deposit_id))
      .collect();

    if (deposits.length === 0) {
      throw new Error("Deposit not found");
    }

    const deposit = deposits[0];
    if (deposit.user_id !== userId) {
      throw new Error("Access denied");
    }

    return await ctx.db.patch(deposit._id, {
      ...args,
      updated_by: userId,
      updated_at: Date.now(),
    });
  },
});

// Delete a deposit
export const remove = mutation({
  args: { deposit_id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the deposit by deposit_id
    const deposits = await ctx.db
      .query("deposit")
      .withIndex("by_deposit_id", (q) => q.eq("deposit_id", args.deposit_id))
      .collect();

    if (deposits.length === 0) {
      throw new Error("Deposit not found");
    }

    const deposit = deposits[0];
    if (deposit.user_id !== userId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(deposit._id);
    return deposit._id;
  },
});
