import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("partial"), v.literal("completed"))),
    customerId: v.optional(v.id("customers")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let sales;
    
    if (args.status) {
      sales = await ctx.db
        .query("sales")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else if (args.customerId) {
      sales = await ctx.db
        .query("sales")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId!))
        .order("desc")
        .collect();
    } else {
      sales = await ctx.db.query("sales").order("desc").collect();
    }
    
    return sales;
  },
});

export const create = mutation({
  args: {
    customerId: v.optional(v.id("customers")),
    customerName: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      total: v.number(),
    })),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    amountPaid: v.number(),
    paymentMethod: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Update product stock
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          stock: Math.max(0, product.stock - item.quantity)
        });
      }
    }

    // Update customer balance if applicable
    if (args.customerId && args.amountPaid < args.total) {
      const customer = await ctx.db.get(args.customerId);
      if (customer) {
        await ctx.db.patch(args.customerId, {
          balance: customer.balance + (args.total - args.amountPaid)
        });
      }
    }

    const status = args.amountPaid === 0 ? "pending" : 
                  args.amountPaid < args.total ? "partial" : "completed";

    return await ctx.db.insert("sales", {
      ...args,
      status,
    });
  },
});

export const addPayment = mutation({
  args: {
    saleId: v.id("sales"),
    amount: v.number(),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const sale = await ctx.db.get(args.saleId);
    if (!sale) throw new Error("Sale not found");

    const newAmountPaid = sale.amountPaid + args.amount;
    const newStatus = newAmountPaid >= sale.total ? "completed" : "partial";

    // Update customer balance
    if (sale.customerId) {
      const customer = await ctx.db.get(sale.customerId);
      if (customer) {
        await ctx.db.patch(sale.customerId, {
          balance: Math.max(0, customer.balance - args.amount)
        });
      }
    }

    return await ctx.db.patch(args.saleId, {
      amountPaid: newAmountPaid,
      status: newStatus,
    });
  },
});

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

    const sales = await ctx.db
      .query("sales")
      .withIndex("by_creation_time", (q) => q.gte("_creationTime", startDate.getTime()))
      .collect();

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amountPaid, 0);
    
    return {
      totalSales,
      totalRevenue,
      averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0,
    };
  },
});
