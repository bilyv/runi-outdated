import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Search, Mail, Phone, Briefcase, Calendar, Shield, MoreVertical } from "lucide-react";
import { Table, TableRow, TableCell } from "../../components/ui/Table";

interface Worker {
  _id: Id<"users">;
  _creationTime: number;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  role: string;
  isActive: boolean;
  lastLogin: number;
}

export function AllWorkers() {
  const workers = useQuery(api.users.list);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (workers !== undefined) {
      setFilteredWorkers(workers as Worker[]);
      setIsLoading(false);
    }
  }, [workers]);

  useEffect(() => {
    if (workers) {
      const filtered = workers.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (worker.email && worker.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (worker.phone && worker.phone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredWorkers(filtered as Worker[]);
    }
  }, [searchTerm, workers]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/40 dark:border-white/10 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Team Members</h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-sans">Manage and monitor your workforce</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email..."
              className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Table 
        headers={["Worker", "Contact Information", "Role", "Status", "Last Active", "Actions"]}
        count={filteredWorkers.length}
      >
        {filteredWorkers.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-8 py-16 text-center text-gray-400 font-sans italic">
              {searchTerm ? "No workers matching your search." : "Your team list is currently empty."}
            </td>
          </tr>
        ) : (
          filteredWorkers.map((worker) => (
            <TableRow key={worker._id}>
              <TableCell>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold font-display text-lg shadow-lg shadow-blue-500/20">
                      {worker.name.charAt(0).toUpperCase()}
                    </div>
                    {worker.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="text-base font-bold text-gray-900 dark:text-white font-display leading-tight">{worker.name}</div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {worker.businessName || "Independent"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1.5">
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 font-medium">
                    <Mail className="w-3 h-3 mr-2 text-blue-500/70" />
                    {worker.email}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 font-medium">
                    <Phone className="w-3 h-3 mr-2 text-indigo-500/70" />
                    {worker.phone || "Not provided"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl w-fit">
                  <Shield className="w-3 h-3 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 font-display">
                    {worker.role}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  worker.isActive 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                    : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                }`}>
                  {worker.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <Calendar className="w-3 h-3 mr-2" />
                  {formatDate(worker.lastLogin)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-all">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </Table>
    </div>
  );
}
