import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate upload URL for file upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Create a file record (used after actual file upload)
export const create = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the file URL from storage
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    
    // Insert record in the files table
    const fileId = await ctx.db.insert("files", {
      file_id: `file_${Date.now()}`,
      user_id: userId,
      file_name: args.fileName,
      file_url: fileUrl || "",
      file_type: args.fileType,
      storage_id: args.storageId,
      folder_id: args.folderId,
      file_size: args.fileSize,
      updated_at: Date.now(),
    });
    
    // Update folder stats if folder is selected
    if (args.folderId) {
      const folder = await ctx.db.get(args.folderId);
      if (folder) {
        await ctx.db.patch(args.folderId, {
          file_count: folder.file_count + 1,
          total_size: folder.total_size + args.fileSize,
          updated_at: Date.now(),
        });
      }
    }
    
    return fileId;
  },
});

// List files in a folder
export const list = query({
  args: {
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    if (args.folderId) {
      return await ctx.db
        .query("files")
        .withIndex("by_folder", (q) => q.eq("folder_id", args.folderId!))
        .collect();
    } else {
      return await ctx.db
        .query("files")
        .withIndex("by_user", (q) => q.eq("user_id", userId))
        .collect();
    }
  },
});

// Get file by ID
export const getById = query({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const file = await ctx.db.get(args.id);
    if (!file || file.user_id !== userId) {
      throw new Error("File not found or access denied");
    }

    return file;
  },
});

// Delete a file
export const deleteFile = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const file = await ctx.db.get(args.id);
    if (!file || file.user_id !== userId) {
      throw new Error("File not found or access denied");
    }

    // Delete the file from storage
    await ctx.storage.delete(file.storage_id);

    // Update folder stats if folder is selected
    if (file.folder_id) {
      const folder = await ctx.db.get(file.folder_id);
      if (folder) {
        await ctx.db.patch(file.folder_id, {
          file_count: Math.max(0, folder.file_count - 1),
          total_size: Math.max(0, folder.total_size - file.file_size),
          updated_at: Date.now(),
        });
      }
    }

    await ctx.db.delete(args.id);
  },
});

// Get URL for a storage ID
export const getUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
