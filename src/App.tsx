import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { BusinessDashboard } from "./components/BusinessDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Authenticated>
        <BusinessDashboard />
      </Authenticated>
      
      <Unauthenticated>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
            <h2 className="text-xl font-semibold text-primary">Business Manager</h2>
          </header>
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Business Manager</h1>
                <p className="text-xl text-gray-600">Sign in to manage your business</p>
              </div>
              <SignInForm />
            </div>
          </main>
        </div>
      </Unauthenticated>
      
      <Toaster />
    </div>
  );
}
