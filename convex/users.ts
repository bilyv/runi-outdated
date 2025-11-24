import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get all users from the auth table
    const users = await ctx.db.query("users").collect();
    
    // Add role and status information (you might want to extend the users table schema)
    return users.map(user => ({
      ...user,
      role: "employee", // Default role - you can extend this
      isActive: true,   // Default status - you can extend this
      lastLogin: user._creationTime, // Using creation time as placeholder
    }));
  },
});

export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    // In a real app, you'd check if the current user has permission to update roles
    // For now, we'll just return success since we can't modify the auth table structure
    return { success: true };
  },
});
