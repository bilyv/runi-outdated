import { useCurrentUser } from "../../lib/utils";
import { UserCircle, Building, Mail, Phone } from "lucide-react";

export function UserProfile() {
  const user = useCurrentUser();

  // Get user details with fallbacks
  const fullName = user?.fullName || user?.businessName || user?.email || "User";
  const businessName = user?.businessName || "Not specified";
  const email = user?.businessEmail || user?.email || "Not specified";
  const phone = user?.phoneNumber || "Not specified";

  // Extract initials from the full name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(fullName);

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Profile Information</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal and business details
        </p>
      </div>
      
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              {initials}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text">{fullName}</h3>
            <p className="text-gray-600 dark:text-gray-400">{businessName}</p>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <UserCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-dark-text">Full Name</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{fullName}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Building className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-dark-text">Business Name</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{businessName}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-dark-text">Email Address</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{email}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-dark-text">Phone Number</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}