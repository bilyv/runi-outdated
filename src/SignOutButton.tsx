"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 rounded bg-white dark:bg-dark-card text-secondary dark:text-dark-text border border-gray-200 dark:border-dark-border font-semibold hover:bg-gray-50 dark:hover:bg-dark-card/80 hover:text-secondary-hover dark:hover:text-dark-text transition-colors shadow-sm hover:shadow"
      onClick={() => void signOut()}
    >
      Sign out
    </button>
  );
}
