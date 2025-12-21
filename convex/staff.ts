import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        return await ctx.db
            .query("staff")
            .withIndex("by_user", (q) => q.eq("user_id", userId))
            .order("desc")
            .collect();
    },
});

export const checkEmailExists = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const staff = await ctx.db
            .query("staff")
            .withIndex("by_email", (q) => q.eq("email_address", args.email))
            .unique();
        return !!staff;
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const create = mutation({
    args: {
        staff_full_name: v.string(),
        email_address: v.string(),
        phone_number: v.string(),
        id_card_front_url: v.string(),
        id_card_back_url: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Check if email already exists
        const existing = await ctx.db
            .query("staff")
            .withIndex("by_email", (q) => q.eq("email_address", args.email_address))
            .unique();
        if (existing) throw new Error("Staff member with this email already exists");

        const staffId = await ctx.db.insert("staff", {
            staff_id: `staff_${Date.now()}`,
            user_id: userId,
            staff_full_name: args.staff_full_name,
            email_address: args.email_address,
            phone_number: args.phone_number,
            id_card_front_url: args.id_card_front_url,
            id_card_back_url: args.id_card_back_url,
            password: args.password,
            failed_login_attempts: 0,
            updated_at: Date.now(),
        });

        return staffId;
    },
});

export const getStorageUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const remove = mutation({
    args: { id: v.id("staff") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        await ctx.db.delete(args.id);
    },
});
