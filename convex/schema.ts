import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Extend the auth users table with custom business fields
const customAuthTables = {
  ...authTables,
  users: defineTable({
    // Standard auth fields
    ...authTables.users.validator.fields,
    // Custom business fields
    businessName: v.optional(v.string()),
    businessEmail: v.optional(v.string()),
    fullName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
  })
    .index("email", ["email"])
    .index("businessEmail", ["businessEmail"]),
};

const applicationTables = {
  // Products
  products: defineTable({
    name: v.string(),
    sku: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    costPrice: v.number(),
    sellingPrice: v.number(),
    stock: v.number(),
    minStock: v.number(),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_sku", ["sku"])
    .index("by_category", ["category"])
    .index("by_stock", ["stock"]),



  // Sales
  sales: defineTable({
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
    status: v.union(v.literal("pending"), v.literal("partial"), v.literal("completed")),
    paymentMethod: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"]),

  // Expenses
  expenses: defineTable({
    category: v.string(),
    description: v.string(),
    amount: v.number(),
    paymentMethod: v.string(),
    receiptUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_category", ["category"]),

  // Documents
  documents: defineTable({
    name: v.string(),
    type: v.string(),
    size: v.number(),
    storageId: v.id("_storage"),
    folderId: v.optional(v.id("folders")),
    tags: v.array(v.string()),
    uploadedBy: v.id("users"),
  })
    .index("by_folder", ["folderId"])
    .index("by_type", ["type"]),

  folders: defineTable({
    name: v.string(),
    parentId: v.optional(v.id("folders")),
    createdBy: v.id("users"),
  })
    .index("by_parent", ["parentId"]),

  // Settings
  settings: defineTable({
    key: v.string(),
    value: v.string(),
    category: v.string(),
  })
    .index("by_key", ["key"])
    .index("by_category", ["category"]),
};

export default defineSchema({
  ...customAuthTables,
  ...applicationTables,
});
