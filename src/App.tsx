import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./features/auth/SignInForm";
import { SignUpForm } from "./features/auth/SignUpForm";
import { ForgotPasswordForm } from "./features/auth/ForgotPasswordForm";
import { SignOutButton } from "./features/auth/SignOutButton";
import { Toaster } from "sonner";
import { BusinessDashboard } from "./components/layout/BusinessDashboard";
import { useState } from "react";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  const [authView, setAuthView] = useState<'signIn' | 'signUp' | 'forgotPassword'>('signIn');

  const AuthForm = () => {
    if (authView === 'signUp') {
      return <SignUpForm onSwitchToSignIn={() => setAuthView('signIn')} />;
    }
    if (authView === 'forgotPassword') {
      return <ForgotPasswordForm onSwitchToSignIn={() => setAuthView('signIn')} />;
    }
    return <SignInForm
      onSwitchToSignUp={() => setAuthView('signUp')}
      onSwitchToForgotPassword={() => setAuthView('forgotPassword')}
    />;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg dark:text-dark-text">
        <Authenticated>
          <BusinessDashboard />
        </Authenticated>

        <Unauthenticated>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Runi</h1>
                <p className="text-gray-600">Manage your business operations efficiently</p>
              </div>
              <AuthForm />
            </div>
          </div>
        </Unauthenticated>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}