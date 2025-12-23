import { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReportPDF } from './ReportPDF';
import {
  FileText,
  Download,
  TrendingUp,
  Package,
  Wallet,
  Calendar as CalendarIcon,
  ChevronRight,
  Loader2,
  X,
  Check
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subDays
} from 'date-fns';
import { cn } from '../../lib/utils';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

type ReportType = 'sales' | 'inventory' | 'expenses';
type DateOption = 'today' | 'week' | 'month' | 'custom';

export function Reports() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('sales');
  const [dateOption, setDateOption] = useState<DateOption>('month');
  const [customRange, setCustomRange] = useState({
    from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  const user = useQuery(api.users.currentUser);

  // Derived date range for queries
  const activeRange = useMemo(() => {
    const now = new Date();
    switch (dateOption) {
      case 'today':
        return { from: startOfDay(now), to: endOfDay(now) };
      case 'week':
        return { from: startOfWeek(now), to: endOfWeek(now) };
      case 'month':
        return { from: startOfMonth(now), to: endOfMonth(now) };
      case 'custom':
        return {
          from: startOfDay(new Date(customRange.from)),
          to: endOfDay(new Date(customRange.to))
        };
      default:
        return { from: startOfMonth(now), to: endOfMonth(now) };
    }
  }, [dateOption, customRange]);

  // Queries
  const salesData = useQuery(api.reports.getSalesReport,
    (isModalOpen && selectedReportType === 'sales') ? { startDate: activeRange.from.getTime(), endDate: activeRange.to.getTime() } : 'skip'
  );
  const inventoryData = useQuery(api.reports.getInventoryReport,
    (isModalOpen && selectedReportType === 'inventory') ? {} : 'skip'
  );
  const expenseData = useQuery(api.reports.getExpenseReport,
    (isModalOpen && selectedReportType === 'expenses') ? { startDate: activeRange.from.getTime(), endDate: activeRange.to.getTime() } : 'skip'
  );

  const isLoading = (selectedReportType === 'sales' && salesData === undefined) ||
    (selectedReportType === 'inventory' && inventoryData === undefined) ||
    (selectedReportType === 'expenses' && expenseData === undefined);

  // Prepare PDF data based on type
  const pdfProps = useMemo(() => {
    if (!isModalOpen) return null;

    const businessName = user?.businessName || 'Runi Business';
    const rangeStr = selectedReportType === 'inventory'
      ? format(new Date(), 'PP')
      : `${format(activeRange.from, 'PP')} - ${format(activeRange.to, 'PP')}`;

    if (selectedReportType === 'sales' && salesData) {
      return {
        title: 'Sales Report',
        businessName,
        dateRange: rangeStr,
        data: salesData.sales || [],
        columns: [
          { label: 'Date', key: 'updated_at', format: (v: number) => format(v, 'PP') },
          { label: 'Client', key: 'client_name' },
          { label: 'Method', key: 'payment_method' },
          { label: 'Total', key: 'total_amount', format: (v: number) => `$${v.toFixed(2)}` },
          { label: 'Paid', key: 'amount_paid', format: (v: number) => `$${v.toFixed(2)}` },
          { label: 'Status', key: 'payment_status' }
        ],
        totals: [
          { label: 'Total Sales', value: salesData.totals.count.toString() },
          { label: 'Total Revenue', value: `$${salesData.totals.revenue.toFixed(2)}` },
          { label: 'Total Paid', value: `$${salesData.totals.paid.toFixed(2)}` }
        ]
      };
    }

    if (selectedReportType === 'inventory' && inventoryData) {
      return {
        title: 'Inventory Report',
        businessName,
        dateRange: rangeStr,
        data: inventoryData.products || [],
        columns: [
          { label: 'Product Name', key: 'name' },
          { label: 'Category', key: 'categoryName' },
          { label: 'Boxes', key: 'quantity_box' },
          { label: 'Kg', key: 'quantity_kg' },
          { label: 'Cost Val', key: 'cost_per_box', format: (v: number) => `$${v.toFixed(2)}` },
          { label: 'Price Val', key: 'price_per_box', format: (v: number) => `$${v.toFixed(2)}` }
        ],
        totals: [
          { label: 'Total Items', value: inventoryData.totals.count.toString() },
          { label: 'Total Value', value: `$${inventoryData.totals.value.toFixed(2)}` },
          { label: 'Potential Profit', value: `$${inventoryData.totals.potentialProfit.toFixed(2)}` }
        ]
      };
    }

    if (selectedReportType === 'expenses' && expenseData) {
      return {
        title: 'Expense Report',
        businessName,
        dateRange: rangeStr,
        data: expenseData.expenses || [],
        columns: [
          { label: 'Date', key: 'date', format: (v: number) => format(v, 'PP') },
          { label: 'Title', key: 'title' },
          { label: 'Category', key: 'categoryName' },
          { label: 'Added By', key: 'addedBy' },
          { label: 'Amount', key: 'amount', format: (v: number) => `$${v.toFixed(2)}` }
        ],
        totals: [
          { label: 'Total Count', value: expenseData.totals.count.toString() },
          { label: 'Total Expenses', value: `$${expenseData.totals.amount.toFixed(2)}` }
        ]
      };
    }

    return null;
  }, [selectedReportType, salesData, inventoryData, expenseData, user, activeRange, isModalOpen]);

  const reportCards = [
    {
      id: 'sales' as ReportType,
      title: "Sales Report",
      description: "Track your revenue and payment collections",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-600",
      lightColor: "bg-blue-50 dark:bg-blue-900/10 text-blue-600"
    },
    {
      id: 'inventory' as ReportType,
      title: "Inventory Report",
      description: "Current stock levels and valuation summary",
      icon: Package,
      color: "from-emerald-500 to-teal-600",
      lightColor: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600"
    },
    {
      id: 'expenses' as ReportType,
      title: "Expense Report",
      description: "Analyze your business spending by category",
      icon: Wallet,
      color: "from-purple-500 to-pink-600",
      lightColor: "bg-purple-50 dark:bg-purple-900/10 text-purple-600"
    }
  ];

  const handleOpenModal = (type: ReportType) => {
    setSelectedReportType(type);
    setIsModalOpen(true);
  };

  const dateOptions = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
          <FileText className="w-10 h-10 text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Gain deep insights into your business performance and growth with detailed PDF reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleOpenModal(card.id)}
            className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            {/* Background Gradient Detail */}
            <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500", card.color)} />

            <div className="relative z-10 space-y-6">
              <div className={cn("inline-flex p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300", card.lightColor)}>
                <card.icon className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold dark:text-white">{card.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{card.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="secondary"
                  className="rounded-xl px-6 font-bold group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  View Report
                </Button>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Date Range"
      >
        <div className="p-2 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Reporting Period
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {dateOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDateOption(opt.id as DateOption)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-bold transition-all border",
                    dateOption === opt.id
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {dateOption === 'custom' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">From</label>
                    <input
                      type="date"
                      value={customRange.from}
                      onChange={(e) => setCustomRange(prev => ({ ...prev, from: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border-none rounded-xl text-sm font-medium outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">To</label>
                    <input
                      type="date"
                      value={customRange.to}
                      onChange={(e) => setCustomRange(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/10 border-none rounded-xl text-sm font-medium outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t dark:border-white/5">
            {isLoading ? (
              <Button disabled className="w-full h-14 rounded-2xl opacity-50 cursor-not-allowed">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Preparing Data...
              </Button>
            ) : pdfProps ? (
              <PDFDownloadLink
                document={<ReportPDF {...pdfProps} />}
                fileName={`${selectedReportType}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
                className="block"
              >
                {({ loading }) => (
                  <Button
                    className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 font-bold text-lg"
                    disabled={loading}
                    variant="primary"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating PDF...</>
                    ) : (
                      <><Download className="w-5 h-5 mr-2" /> Download {selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Report</>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            ) : (
              <Button disabled className="w-full h-14 rounded-2xl opacity-50 cursor-not-allowed">
                No data available for this range
              </Button>
            )}
          </div>

          <p className="text-center text-xs text-gray-400">
            This report will include all {selectedReportType} data from {format(activeRange.from, 'PPP')} to {format(activeRange.to, 'PPP')}.
          </p>
        </div>
      </Modal>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-dark-card dark:to-black rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex px-4 py-2 bg-primary/20 rounded-full text-primary-light text-xs font-bold uppercase tracking-widest border border-primary/30">
              New Feature Available
            </div>
            <h2 className="text-3xl font-bold">Comprehensive Inventory Analytics</h2>
            <p className="text-gray-400 leading-relaxed">
              Our new reporting engine now supports deep-dive inventory audits. Track cost value, potential profit, and stock alerts in a single professional PDF document.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 backdrop-blur-sm">
              <Package className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
