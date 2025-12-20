import { Package, Pencil, Trash2, Plus, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { motion } from "framer-motion";

interface ProductCategoryProps {
    categories: Array<{ _id: any; category_name: string; _creationTime: number }>;
    onAddCategory: () => void;
    onEditCategory: (category: any) => void;
    onDeleteCategory: (categoryId: any) => void;
}

export function ProductCategory({
    categories,
    onAddCategory,
    onEditCategory,
    onDeleteCategory
}: ProductCategoryProps) {
    return (
        <div className="space-y-8">
            <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/40 dark:border-white/10 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Product Categories</h2>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-sans">Organize your inventory with custom categories</p>
                    </div>
                    <Button
                        variant="primary"
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display font-bold shadow-lg shadow-blue-500/20 group transition-all hover:scale-105 active:scale-95"
                        onClick={onAddCategory}
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        New Category
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.length > 0 ? (
                    categories.map((cat, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={cat._id}
                            className="group relative bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2rem] p-6 border border-white/40 dark:border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden"
                        >
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                            
                            <div className="relative flex flex-col h-full space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <Package size={22} />
                                    </div>
                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => onEditCategory(cat)}
                                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors"
                                            title="Edit category"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteCategory(cat._id)}
                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                            title="Delete category"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display tracking-tight leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {cat.category_name}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                                        System Category
                                    </p>
                                </div>

                                <div className="pt-4 mt-auto border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-sm">
                                    <span className="text-gray-400 font-sans">Created {new Date(cat._creationTime).toLocaleDateString()}</span>
                                    <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-dashed border-gray-300 dark:border-white/10 py-16 text-center">
                        <div className="max-w-xs mx-auto space-y-4">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                <Package size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">No categories found</h3>
                            <p className="text-sm text-gray-500 font-sans">Start organizing your inventory by adding your first product category.</p>
                            <Button
                                variant="primary"
                                className="w-full mt-4 rounded-xl font-display"
                                onClick={onAddCategory}
                            >
                                Add Your First Category
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
