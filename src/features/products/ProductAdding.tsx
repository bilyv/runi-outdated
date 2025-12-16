import { Plus, PackagePlus, ArchiveRestore, AlertTriangle, Edit3 } from "lucide-react";
import { Button } from "../../components/ui/Button";

interface ProductAddingProps {
}

export function ProductAdding({}: ProductAddingProps) {
    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border flex flex-col items-center text-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3">
                        <PackagePlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2">Add New Product</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Create and register a new product in your inventory
                    </p>
                    <Button variant="secondary" className="w-full text-sm">
                        Add Product
                    </Button>
                </div>

                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border flex flex-col items-center text-center">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-3">
                        <ArchiveRestore className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2">Restock</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Increase quantity of existing products in stock
                    </p>
                    <Button variant="secondary" className="w-full text-sm">
                        Restock Items
                    </Button>
                </div>

                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border flex flex-col items-center text-center">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mb-3">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2">Record Damaged</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Log products that are damaged or unusable
                    </p>
                    <Button variant="secondary" className="w-full text-sm">
                        Record Damage
                    </Button>
                </div>

                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border flex flex-col items-center text-center">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
                        <Edit3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-dark-text mb-2">Stock Correction</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Adjust stock quantities for accuracy and corrections
                    </p>
                    <Button variant="secondary" className="w-full text-sm">
                        Correct Stock
                    </Button>
                </div>
            </div>
        </div>
    );
}
