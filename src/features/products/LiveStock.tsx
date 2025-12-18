import { useState } from "react";
import { Search, Filter, Package, AlertTriangle, Edit3, Trash2, Check, X } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface LiveStockProps {
    search: string;
    setSearch: (search: string) => void;
    products: any[];
    categories: any[];
}

export function LiveStock({
    search,
    setSearch,
    products,
    categories,
}: LiveStockProps) {
    const [currentView, setCurrentView] = useState("all");
    const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

    // Fetch damaged products and stock movements
    const damagedProducts = useQuery(api.products.getDamagedProducts) || [];
    const stockMovements = useQuery(api.products.getStockMovements) || [];

    // Helper to get category name
    const getCategoryName = (categoryId: string) => {
        return categories?.find((c: any) => c._id === categoryId)?.category_name || "Uncategorized";
    };

    // Filter products based on current view
    const filteredProducts = products?.filter((product: any) => {
        // Basic search filter
        if (search) {
            const searchLower = search.toLowerCase();
            const matchesSearch = product.name.toLowerCase().includes(searchLower) ||
                (product.sku && product.sku.toLowerCase().includes(searchLower));
            if (!matchesSearch) return false;
        }

        switch (currentView) {
            case "lowStock":
                return (product.quantity_box || 0) <= (product.boxed_low_stock_threshold || 5);
            case "nearingExpiry":
                return (product.days_left || 999) <= 30; // 30 days threshold
            case "damaged":
                return false; // We'll use damagedProducts data instead
            case "stockAdjustment":
                return true; // Show all for now
            default:
                return true;
        }
    });

    const views = [
        { id: "all", label: "All Product View" },
        { id: "lowStock", label: "Low Stock Items View" },
        { id: "damaged", label: "Damaged Products View" },
        { id: "nearingExpiry", label: "Nearing Expiry View" },
        { id: "stockAdjustment", label: "Stock Adjustment View" },
    ];

    const getCurrentViewLabel = () => {
        return views.find(v => v.id === currentView)?.label || "All Product View";
    };

    // Render All Products View
    const renderAllProductsView = () => (
        <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Boxes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        KG Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Box Ratio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Selling
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                {filteredProducts?.length > 0 ? (
                    filteredProducts.map((product: any, index: number) => (
                        <tr key={product._id} className={index % 2 === 0 ? "bg-white dark:bg-dark-card" : "bg-gray-50 dark:bg-dark-card/50"}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                                    {getCategoryName(product.category_id)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`text-sm font-medium ${(product.quantity_box || 0) <= (product.boxed_low_stock_threshold || 5)
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-900 dark:text-dark-text"
                                    }`}>
                                    {product.quantity_box || 0}
                                </span>
                                {(product.quantity_box || 0) <= (product.boxed_low_stock_threshold || 5) && (
                                    <AlertTriangle size={16} className="inline ml-1 text-red-500 dark:text-red-400" />
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                {product.quantity_kg || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                1:{product.box_to_kg_ratio || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                <div className="flex flex-col">
                                    <span>Box: ${(product.price_per_box || 0).toFixed(2)}</span>
                                    <span>KG: ${(product.price_per_kg || 0).toFixed(2)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                <div className="flex flex-col">
                                    <span>Box: ${(product.cost_per_box || 0).toFixed(2)}</span>
                                    <span>KG: ${(product.cost_per_kg || 0).toFixed(2)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                <div className="flex flex-col">
                                    <span>Box: ${((product.price_per_box || 0) - (product.cost_per_box || 0)).toFixed(2)}</span>
                                    <span>KG: ${((product.price_per_kg || 0) - (product.cost_per_kg || 0)).toFixed(2)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                                    <Edit3 size={16} />
                                </button>
                                <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={10} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center gap-2">
                                <Package size={40} className="text-gray-300 dark:text-gray-600 mb-2" />
                                <p className="font-medium">No products found</p>
                                <p className="text-sm">Try adjusting your search terms.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    // Render Low Stock Items View
    const renderLowStockView = () => (
        <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Low Stock Threshold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Box Ratio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Selling
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Profit
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                {filteredProducts?.length > 0 ? (
                    filteredProducts.map((product: any, index: number) => (
                        <tr key={product._id} className={index % 2 === 0 ? "bg-white dark:bg-dark-card" : "bg-gray-50 dark:bg-dark-card/50"}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                                    {getCategoryName(product.category_id)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-dark-text">
                                    {product.quantity_box || 0} Boxes / {product.quantity_kg || 0} KG
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                {product.boxed_low_stock_threshold || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                1:{product.box_to_kg_ratio || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                <div className="flex flex-col">
                                    <span>Box: ${(product.price_per_box || 0).toFixed(2)}</span>
                                    <span>KG: ${(product.price_per_kg || 0).toFixed(2)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                <div className="flex flex-col">
                                    <span>Box: ${(product.cost_per_box || 0).toFixed(2)}</span>
                                    <span>KG: ${(product.cost_per_kg || 0).toFixed(2)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                <div className="flex flex-col">
                                    <span>Box: ${((product.price_per_box || 0) - (product.cost_per_box || 0)).toFixed(2)}</span>
                                    <span>KG: ${((product.price_per_kg || 0) - (product.cost_per_kg || 0)).toFixed(2)}</span>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center gap-2">
                                <Package size={40} className="text-gray-300 dark:text-gray-600 mb-2" />
                                <p className="font-medium">No low stock products found</p>
                                <p className="text-sm">No products are currently below their low stock threshold.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    // Render Damaged Products View
    const renderDamagedProductsView = () => (
        <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Loss Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                {damagedProducts?.length > 0 ? (
                    damagedProducts.map((damaged: any, index: number) => (
                        <tr key={damaged.damage_id} className={index % 2 === 0 ? "bg-white dark:bg-dark-card" : "bg-gray-50 dark:bg-dark-card/50"}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                    {damaged.product_name}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-dark-text">
                                    {damaged.damaged_boxes || 0} Boxes
                                </div>
                                <div className="text-sm text-gray-900 dark:text-dark-text">
                                    {damaged.damaged_kg || 0} KG
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text max-w-xs truncate">
                                {damaged.damage_reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                {damaged.damage_date || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                ${(damaged.loss_value || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${damaged.damage_approval === "approved"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                    }`}>
                                    {damaged.damage_approval === "approved" ? "Approved" : "Pending"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                {damaged.reported_by || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center gap-2">
                                <Package size={40} className="text-gray-300 dark:text-gray-600 mb-2" />
                                <p className="font-medium">No damaged products recorded</p>
                                <p className="text-sm">No products have been marked as damaged yet.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    // Render Nearing Expiry View
    const renderNearingExpiryView = () => (
        <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Days Until Expiry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Box Ratio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Selling
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Profit
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                {filteredProducts?.length > 0 ? (
                    filteredProducts.map((product: any, index: number) => (
                        <tr key={product._id} className={index % 2 === 0 ? "bg-white dark:bg-dark-card" : "bg-gray-50 dark:bg-dark-card/50"}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                                    {getCategoryName(product.category_id)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-dark-text">
                                    {product.quantity_box || 0} Boxes
                                </div>
                                <div className="text-sm text-gray-900 dark:text-dark-text">
                                    {product.quantity_kg || 0} KG
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                {product.expiry_date || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${(product.days_left || 999) <= 10
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    : (product.days_left || 999) <= 30
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    }`}>
                                    {product.days_left !== undefined ? `${product.days_left} days` : "-"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                1:{product.box_to_kg_ratio || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                <div className="flex flex-col">
                                    <span>Box: ${(product.price_per_box || 0).toFixed(2)}</span>
                                    <span>KG: ${(product.price_per_kg || 0).toFixed(2)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                <div className="flex flex-col">
                                    <span>Box: ${(product.cost_per_box || 0).toFixed(2)}</span>
                                    <span>KG: ${(product.cost_per_kg || 0).toFixed(2)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                <div className="flex flex-col">
                                    <span>Box: ${((product.price_per_box || 0) - (product.cost_per_box || 0)).toFixed(2)}</span>
                                    <span>KG: ${((product.price_per_kg || 0) - (product.cost_per_kg || 0)).toFixed(2)}</span>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center gap-2">
                                <Package size={40} className="text-gray-300 dark:text-gray-600 mb-2" />
                                <p className="font-medium">No products nearing expiry</p>
                                <p className="text-sm">No products are expiring within the next 30 days.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    // Render Stock Adjustment / Stock Movement History View
    const renderStockAdjustmentView = () => (
        <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Stock Before Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Change or Old vs New Values
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Reason & Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Performed By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                {stockMovements?.length > 0 ? (
                    stockMovements.map((movement: any, index: number) => (
                        <tr key={movement.movement_id} className={index % 2 === 0 ? "bg-white dark:bg-dark-card" : "bg-gray-50 dark:bg-dark-card/50"}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                {new Date(movement.updated_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                    {movement.product_name}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                                    {movement.movement_type || "-"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                {movement.old_value || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-dark-text">
                                    Old: {movement.old_value || 0}
                                </div>
                                <div className="text-sm text-gray-900 dark:text-dark-text">
                                    New: {movement.new_value || 0}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text max-w-xs truncate">
                                {movement.reason || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                                {movement.performed || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${movement.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                    }`}>
                                    {movement.status || "-"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                {movement.status === "pending" && (
                                    <>
                                        <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                                            <Check size={16} />
                                        </button>
                                        <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                                            <X size={16} />
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center gap-2">
                                <Package size={40} className="text-gray-300 dark:text-gray-600 mb-2" />
                                <p className="font-medium">No stock adjustments recorded</p>
                                <p className="text-sm">No stock movements have been recorded yet.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    // Render the appropriate view based on currentView
    const renderCurrentView = () => {
        switch (currentView) {
            case "all":
                return renderAllProductsView();
            case "lowStock":
                return renderLowStockView();
            case "damaged":
                return renderDamagedProductsView();
            case "nearingExpiry":
                return renderNearingExpiryView();
            case "stockAdjustment":
                return renderStockAdjustmentView();
            default:
                return renderAllProductsView();
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* View Switcher Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-dark-card/80 transition-colors"
                    >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {getCurrentViewLabel()}
                        </span>
                        <Filter size={16} className="text-gray-500 dark:text-gray-400" />
                    </button>

                    {isViewDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsViewDropdownOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                                {views.map((view) => (
                                    <button
                                        key={view.id}
                                        onClick={() => {
                                            setCurrentView(view.id);
                                            setIsViewDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${currentView === view.id
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-border/50"
                                            }`}
                                    >
                                        {view.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border overflow-hidden">
                <div className="overflow-x-auto">
                    {renderCurrentView()}
                </div>
            </div>
        </div>
    );
}
