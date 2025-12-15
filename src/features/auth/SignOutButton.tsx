"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useCurrentUser } from "../../lib/utils";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const user = useCurrentUser();

  if (!isAuthenticated) {
    return null;
  }

  // Get user's full name or fallback to email
  const fullName = user?.fullName || user?.businessName || user?.email || "User";

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
    <div className="flex items-center justify-between w-full rounded-lg bg-white dark:bg-dark-card text-secondary dark:text-dark-text border border-gray-200 dark:border-dark-border font-medium shadow-sm px-3 py-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {initials}
          </span>
        </div>
        <span className="truncate text-sm">{fullName}</span>
      </div>
      <button
        className="text-sm hover:bg-gray-100 dark:hover:bg-dark-card/50 rounded px-2 py-1 transition-colors"
        onClick={() => void signOut()}
      >
        Sign out
      </button>
    </div>
  );
}