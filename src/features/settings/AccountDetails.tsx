import { useState } from "react";
import { useCurrentUser } from "../../lib/utils";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { toast } from "sonner";

export function AccountDetails() {
  const user = useCurrentUser();
  
  // Initialize form state with user data
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    businessName: user?.businessName || "",
    businessEmail: user?.businessEmail || user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // In a real implementation, you would call a Convex mutation to update user details
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Account details updated successfully!");
    } catch (error) {
      console.error("Error updating account details:", error);
      toast.error("Failed to update account details. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Account Details</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Update your personal and business information
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={isUpdating}
            />
          </div>
          
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business Name
            </label>
            <Input
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter your business name"
              disabled={isUpdating}
            />
          </div>
          
          <div>
            <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <Input
              id="businessEmail"
              name="businessEmail"
              type="email"
              value={formData.businessEmail}
              onChange={handleChange}
              placeholder="Enter your email address"
              disabled={isUpdating}
            />
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              disabled={isUpdating}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Details"}
          </Button>
        </div>
      </form>
    </div>
  );
}