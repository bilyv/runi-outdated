import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "convex/dist/esm/types";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { Table, TableRow, TableCell } from "../../components/ui/Table";

export function ExpenseList() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState<Id<"expensecategory"> | "">("");
  
  const expenses = useQuery(api.expenses.list, {
    ...(categoryId && { categoryId: categoryId as Id<"expensecategory"> }),
  });
  
  const categories = useQuery(api.expenseCategories.list);
  const deleteExpense = useMutation(api.expenses.remove);

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "MMM dd, yyyy");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleDelete = async (id: Id<"expenses">) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense({ id });
      } catch (error) {
        console.error("Failed to delete expense:", error);
        alert("Failed to delete expense");
      }
    }
  };

  if (!expenses || !categories) {
    return <div>Loading expenses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/40 dark:border-white/10 p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-bold font-display text-gray-500 dark:text-gray-400 ml-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="endDate" className="block text-sm font-bold font-display text-gray-500 dark:text-gray-400 ml-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="categoryId" className="block text-sm font-bold font-display text-gray-500 dark:text-gray-400 ml-1">
              Category
            </label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as Id<"expensecategory"> | "")}
              className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Expenses Table */}
      <Table 
        headers={["Expense Title", "Category", "Amount", "Date", "Receipt", "Status", "Actions"]}
        title="All Expenses"
        count={expenses.length}
      >
        {expenses.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-8 py-12 text-center text-gray-400 font-sans italic">
              No expenses found. Create your first expense using the "Create Expenses" tab.
            </td>
          </tr>
        ) : (
          expenses.map((expense) => {
            const category = categories.find(c => c._id === expense.categoryId);
            return (
              <TableRow key={expense._id}>
                <TableCell primary>{expense.title}</TableCell>
                <TableCell>{category ? category.name : "Unknown"}</TableCell>
                <TableCell className="font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell>
                  {expense.receiptUrl ? (
                    <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold dark:text-blue-400">
                      View Receipt
                    </a>
                  ) : (
                    <span className="text-gray-300 italic">No receipt</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    expense.status === "paid" 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                  }`}>
                    {expense.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => console.log("Edit expense", expense._id)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </Table>
    </div>
  );
}
