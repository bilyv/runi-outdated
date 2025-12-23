import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Users,
  Package,
  ShoppingCart,
  LineChart,
  Wallet,
  Search,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface PermissionSubGroup {
  id: string;
  label: string;
  permissions: Permission[];
}

interface PermissionGroup {
  id: string;
  label: string;
  icon: any;
  subGroups: PermissionSubGroup[];
}

export function RolesAndPermissions() {
  const staff = useQuery(api.staff.list);
  const [selectedStaffId, setSelectedStaffId] = useState<Id<"staff"> | null>(null);
  const [activeTab, setActiveTab] = useState<string>("product");
  const [activeSubTab, setActiveSubTab] = useState<string>("categories");
  const [searchQuery, setSearchQuery] = useState("");

  const staffPermissions = useQuery(api.staff.getStaffPermissions, selectedStaffId ? { staffId: selectedStaffId } : "skip");
  const updatePermission = useMutation(api.staff.updateStaffPermission);

  const permissionsMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    staffPermissions?.forEach(p => {
      map[p.permission_key] = p.is_enabled;
    });
    return map;
  }, [staffPermissions]);

  const groupMasterStatus = useMemo(() => {
    return {
      "product": !!permissionsMap["main_product"],
      "sales": !!permissionsMap["main_sales"],
      "cash-tracking": !!permissionsMap["main_cash-tracking"]
    } as Record<string, boolean>;
  }, [permissionsMap]);

  const selectedStaff = staff?.find(s => s._id === selectedStaffId);

  const permissionGroups = useMemo<PermissionGroup[]>(() => [
    {
      id: "product",
      label: "Product",
      icon: Package,
      subGroups: [
        {
          id: "categories",
          label: "Categories",
          permissions: [
            { id: "p4_view", name: "View Category", description: "Allow staff to see product categories", enabled: !!permissionsMap["p4_view"] },
            { id: "p4_add", name: "Add Category", description: "Allow staff to create new product categories", enabled: !!permissionsMap["p4_add"] },
            { id: "p4_edit", name: "Edit Category", description: "Allow staff to modify existing product categories", enabled: !!permissionsMap["p4_edit"] },
            { id: "p4_delete", name: "Delete Category", description: "Allow staff to remove product categories", enabled: !!permissionsMap["p4_delete"] },
          ]
        },
        {
          id: "product-adding",
          label: "Product Adding",
          permissions: [
            { id: "p2_view", name: "View Product List", description: "Allow staff to see all product entries", enabled: !!permissionsMap["p2_view"] },
            { id: "p2_add", name: "Add New Product", description: "Allow staff to create new product entries", enabled: !!permissionsMap["p2_add"] },
            { id: "p2_restock", name: "Restock", description: "Allow staff to add stock to existing products", enabled: !!permissionsMap["p2_restock"] },
            { id: "p2_damaged", name: "Record Damaged", description: "Allow staff to record damaged stock", enabled: !!permissionsMap["p2_damaged"] },
            { id: "p2_correct", name: "Stock Correction", description: "Allow staff to manually adjust stock levels", enabled: !!permissionsMap["p2_correct"] },
          ]
        },
        {
          id: "live-stock",
          label: "Live Stock",
          permissions: [
            { id: "p1_view", name: "View Stock", description: "Allow staff to see current stock levels", enabled: !!permissionsMap["p1_view"] },
            { id: "p1_all", name: "All Products", description: "Allow staff to view all inventory items", enabled: !!permissionsMap["p1_all"] },
            { id: "p1_low", name: "Low Stock", description: "Allow staff to view items with low stock levels", enabled: !!permissionsMap["p1_low"] },
            { id: "p1_damaged", name: "Damaged Products", description: "Allow staff to view lists of damaged items", enabled: !!permissionsMap["p1_damaged"] },
            { id: "p1_expiry", name: "Nearing Expiry", description: "Allow staff to view items close to expiration", enabled: !!permissionsMap["p1_expiry"] },
          ]
        }
      ]
    },
    {
      id: "sales",
      label: "Sales",
      icon: ShoppingCart,
      subGroups: [
        {
          id: "add-sale",
          label: "Add Sale",
          permissions: [
            { id: "s5_view", name: "Allow Add Sale", description: "Allow staff to access the sale creation interface", enabled: !!permissionsMap["s5_view"] },
          ]
        },
        {
          id: "manage-sales",
          label: "Manage Sales",
          permissions: [
            { id: "s1_view", name: "View Sales Config", description: "Allow staff to see sales configurations", enabled: !!permissionsMap["s1_view"] },
            { id: "s1_edit", name: "Edit Sales Config", description: "Allow staff to modify sales configurations", enabled: !!permissionsMap["s1_edit"] },
            { id: "s1_delete", name: "Delete Sales Config", description: "Allow staff to remove sales configurations", enabled: !!permissionsMap["s1_delete"] },
          ]
        },
        {
          id: "audit-sales",
          label: "Audit Sales",
          permissions: [
            { id: "s4_view", name: "View Sales Audit", description: "Allow staff to see sales validation history", enabled: !!permissionsMap["s4_view"] },
            { id: "s4_confirm", name: "Confirm Sale", description: "Allow staff to confirm and validate sales", enabled: !!permissionsMap["s4_confirm"] },
            { id: "s4_reject", name: "Reject Sale", description: "Allow staff to reject or cancel sales", enabled: !!permissionsMap["s4_reject"] },
          ]
        }
      ]
    },
    {
      id: "cash-tracking",
      label: "Cash Tracking",
      icon: LineChart,
      subGroups: [
        {
          id: "deposited",
          label: "Deposited",
          permissions: [
            { id: "c1_view", name: "View Deposited", description: "Allow staff to see deposited cash records", enabled: !!permissionsMap["c1_view"] },
            { id: "c1_create", name: "Create Deposition", description: "Allow staff to record new cash depositions", enabled: !!permissionsMap["c1_create"] },
            { id: "c1_edit", name: "Edit Deposited", description: "Allow staff to modify deposited cash records", enabled: !!permissionsMap["c1_edit"] },
            { id: "c1_delete", name: "Delete Deposited", description: "Allow staff to remove deposited cash records", enabled: !!permissionsMap["c1_delete"] },
          ]
        },
        {
          id: "debtor",
          label: "Debtor",
          permissions: [
            { id: "c2_view", name: "View Debtors", description: "Allow staff to see the list of debtors", enabled: !!permissionsMap["c2_view"] },
          ]
        }
      ]
    }
  ], [permissionsMap]);

  const [nudgeViewId, setNudgeViewId] = useState<string | null>(null);

  const toggleGroupMaster = async (groupId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedStaffId) return;

    const newStatus = !groupMasterStatus[groupId];
    const permissionKey = `main_${groupId}`;

    try {
      await updatePermission({
        staffId: selectedStaffId,
        permissionKey,
        isEnabled: newStatus
      });
    } catch (error) {
      console.error("Failed to update master permission:", error);
    }
  };

  const togglePermission = async (groupId: string, subGroupId: string, permissionId: string) => {
    if (!selectedStaffId) return;
    if (!groupMasterStatus[groupId]) return;

    const subGroup = permissionGroups.find(g => g.id === groupId)?.subGroups.find(sg => sg.id === subGroupId);
    const viewPermission = subGroup?.permissions.find(p => p.id.includes("_view"));
    const isView = permissionId.includes("_view");

    // If trying to enable a non-view permission while view is off, nudge the user
    if (!isView && !viewPermission?.enabled) {
      if (viewPermission) {
        setNudgeViewId(viewPermission.id);
        setTimeout(() => setNudgeViewId(null), 2000);
      }
      return;
    }

    const currentPermission = subGroup?.permissions.find(p => p.id === permissionId);
    const willBeEnabled = !currentPermission?.enabled;

    try {
      // If we're turning OFF a "View" permission, turn off all others in this subgroup
      if (isView && !willBeEnabled) {
        const promises = subGroup?.permissions.map(p =>
          updatePermission({
            staffId: selectedStaffId,
            permissionKey: p.id,
            isEnabled: false
          })
        ) || [];
        await Promise.all(promises);
      } else {
        await updatePermission({
          staffId: selectedStaffId,
          permissionKey: permissionId,
          isEnabled: willBeEnabled
        });
      }
    } catch (error) {
      console.error("Failed to update permission:", error);
    }
  };

  const isSubGroupEnabled = (subGroup: PermissionSubGroup) => {
    return subGroup.permissions.some(p => p.enabled);
  };

  const filteredStaff = staff?.filter(s =>
    s.staff_full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[600px] bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">Roles & Permissions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage access levels for your staff members</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar: Staff List */}
        <div className={cn(
          "w-full md:w-80 border-r border-gray-100 dark:border-white/5 flex flex-col absolute inset-0 z-10 bg-white dark:bg-dark-card md:relative md:bg-transparent md:z-0 transition-transform duration-300 ease-in-out",
          selectedStaffId ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        )}>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-primary/20 rounded-xl text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
            {staff === undefined ? (
              // Loading state
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse mx-2" />
              ))
            ) : filteredStaff && filteredStaff.length > 0 ? (
              filteredStaff.map((member) => (
                <button
                  key={member._id}
                  onClick={() => setSelectedStaffId(member._id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                    selectedStaffId === member._id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold uppercase shrink-0",
                    selectedStaffId === member._id
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                  )}>
                    {member.staff_full_name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left truncate">
                    <p className={cn(
                      "font-semibold text-sm truncate",
                      selectedStaffId === member._id ? "text-white" : "text-gray-900 dark:text-white"
                    )}>
                      {member.staff_full_name}
                    </p>
                    <p className={cn(
                      "text-xs truncate",
                      selectedStaffId === member._id ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {member.email_address}
                    </p>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform md:block",
                    selectedStaffId === member._id ? "text-white opacity-100 translate-x-1" : "text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100",
                    // Always show chevron on mobile to indicate navigation
                    "block opacity-100"
                  )} />
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Users className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No staff members found</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Permissions */}
        <div className={cn(
          "flex-1 overflow-y-auto bg-gray-50/30 dark:bg-transparent absolute inset-0 z-10 md:static md:z-0 bg-white dark:bg-dark-card transition-transform duration-300 ease-in-out",
          selectedStaffId ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}>
          {selectedStaff ? (
            <div className="p-4 md:p-8 h-full flex flex-col">
              {/* Mobile Header with Back Button */}
              <div className="flex items-center gap-2 mb-6 md:mb-8">
                <button
                  onClick={() => setSelectedStaffId(null)}
                  className="p-2 -ml-2 mr-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                    <span className="truncate">{selectedStaff.staff_full_name}</span>
                    <span className="text-xs font-normal px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg whitespace-nowrap">
                      Staff Member
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">Configure access permissions</p>
                </div>
                <div className="hidden md:flex gap-2">
                  <p className="text-xs text-gray-400 italic flex items-center px-4">Changes saved automatically</p>
                </div>
              </div>

              {/* Tabs - Horizontal Scrollable on Mobile */}
              <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 mb-6 md:mb-8 scrollbar-hide">
                <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-max md:w-fit">
                  {permissionGroups.map((group) => {
                    const Icon = group.icon;
                    const isGroupActive = group.subGroups.some(isSubGroupEnabled);
                    const isGroupMasterOn = groupMasterStatus[group.id];

                    return (
                      <div key={group.id} className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTab(group.id);
                            setActiveSubTab(group.subGroups[0].id);
                          }}
                          className={cn(
                            "group/tab flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden",
                            activeTab === group.id
                              ? "bg-white dark:bg-white/10 text-primary shadow-md shadow-primary/5 border border-primary/10"
                              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-transparent",
                            (!isGroupActive || !isGroupMasterOn) && "opacity-50 grayscale-[0.3]"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                            activeTab === group.id ? "bg-primary/10" : "bg-gray-100 dark:bg-white/5"
                          )}>
                            <Icon className={cn("w-4.5 h-4.5", activeTab === group.id ? "text-primary" : "text-gray-400")} />
                          </div>
                          <span className="relative z-10">{group.label}</span>

                          {activeTab === group.id && (
                            <motion.div
                              layoutId="activeTabGlow"
                              className="absolute inset-0 bg-primary/[0.03] dark:bg-primary/[0.08]"
                              initial={false}
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </button>

                        {/* Improved Group Master Switch */}
                        <div className={cn(
                          "flex items-center gap-2 px-2.5 py-1.5 rounded-full transition-all",
                          isGroupMasterOn
                            ? "bg-primary/5 dark:bg-primary/10 border border-primary/10"
                            : "bg-gray-100 dark:bg-white/5 border border-transparent opacity-60"
                        )}>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            isGroupMasterOn ? "text-primary" : "text-gray-400"
                          )}>
                            {isGroupMasterOn ? "Active" : "Off"}
                          </span>
                          <button
                            onClick={(e) => toggleGroupMaster(group.id, e)}
                            className={cn(
                              "w-8 h-4 rounded-full p-0.5 transition-all duration-300 relative flex items-center shrink-0",
                              isGroupMasterOn ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]" : "bg-gray-300 dark:bg-white/20"
                            )}
                          >
                            <motion.div
                              animate={{ x: isGroupMasterOn ? 16 : 0 }}
                              transition={{ type: "spring", stiffness: 600, damping: 30 }}
                              className="w-3 h-3 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto -mx-4 px-4 md:mx-0 md:px-0">
                {/* Sub Tabs */}
                <div className="flex border-b border-gray-100 dark:border-white/5 mb-6">
                  {permissionGroups.find(g => g.id === activeTab)?.subGroups.map((subGroup) => {
                    const isTabActive = isSubGroupEnabled(subGroup);
                    const isGroupMasterOn = groupMasterStatus[activeTab];

                    return (
                      <button
                        key={subGroup.id}
                        onClick={() => setActiveSubTab(subGroup.id)}
                        className={cn(
                          "px-4 py-2 text-sm font-medium border-b-2 transition-all relative flex items-center gap-2",
                          activeSubTab === subGroup.id
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                          (!isTabActive || !isGroupMasterOn) && "opacity-40 grayscale-[0.5]"
                        )}
                      >
                        {subGroup.label}
                        {!isTabActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" title="Not Configured" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-${activeSubTab}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-20 md:pb-0"
                  >
                    {(() => {
                      const currentSubGroup = permissionGroups.find(g => g.id === activeTab)?.subGroups.find(sg => sg.id === activeSubTab);
                      const viewEnabled = currentSubGroup?.permissions.find(p => p.id.includes("_view"))?.enabled;
                      return currentSubGroup?.permissions.map((permission) => {
                        const isView = permission.id.includes("_view");
                        const isNudged = nudgeViewId === permission.id;
                        const isOverallDisabled = !groupMasterStatus[activeTab];

                        return (
                          <div
                            key={permission.id}
                            className={cn(
                              "p-4 md:p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                              permission.enabled
                                ? "bg-white dark:bg-white/5 border-primary/20 shadow-sm"
                                : "bg-gray-50/50 dark:bg-white/[0.02] border-gray-100 dark:border-white/5",
                              (!isView && !viewEnabled || isOverallDisabled) && "opacity-60 saturate-[0.8] brightness-[0.9]",
                              isOverallDisabled && "cursor-not-allowed opacity-40 grayscale pointer-events-none",
                              isNudged && "ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse"
                            )}
                            onClick={() => togglePermission(activeTab, activeSubTab, permission.id)}
                          >
                            {/* Highlight effect for View permission */}
                            {isView && permission.enabled && (
                              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                            )}

                            <div className="flex items-start justify-between gap-4 relative z-10">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={cn(
                                    "font-bold text-base truncate",
                                    isView ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                                  )}>
                                    {permission.name}
                                  </h4>
                                  {permission.enabled && (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                  )}
                                  {isView && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-primary/10 text-primary rounded-md">
                                      Main
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                                  {permission.description}
                                </p>
                              </div>
                              <div className={cn(
                                "w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative flex items-center shrink-0",
                                permission.enabled ? "bg-primary" : "bg-gray-200 dark:bg-white/10"
                              )}>
                                <div className={cn(
                                  "w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm",
                                  permission.enabled ? "translate-x-6" : "translate-x-0"
                                )} />
                              </div>
                            </div>

                            {/* Blue indicator for nudge */}
                            <AnimatePresence>
                              {isNudged && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="absolute inset-0 border-2 border-blue-500 rounded-2xl pointer-events-none"
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      });
                    })()}

                    <div className="xl:col-span-2 p-4 md:p-6 mt-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-2xl flex gap-4 items-start">
                      <AlertCircle className="w-6 h-6 text-orange-500 shrink-0" />
                      <div>
                        <h5 className="font-bold text-orange-900 dark:text-orange-400">Security Warning</h5>
                        <p className="text-sm text-orange-700 dark:text-orange-400/80 mt-1">
                          Changes to permissions will take effect immediately.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Floating Actions */}
              <div className="md:hidden fixed bottom-4 left-4 right-4 flex gap-2 z-20">
                <div className="w-full py-3 text-center text-xs font-medium bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-500 rounded-xl shadow-lg">
                  Changes take effect immediately
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select a Staff Member</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs">
                Choose a staff member to manage their permissions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}