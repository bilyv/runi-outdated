import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { BusinessDashboard } from "./components/BusinessDashboard";
import { useState } from "react";

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
    <div className="min-h-screen bg-gray-50">
      <Authenticated>
        <BusinessDashboard />
      </Authenticated>

      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Manager</h1>
              <p className="text-gray-600">Manage your business operations efficiently</p>
            </div>
            <AuthForm />
          </div>
        </div>
      </Unauthenticated>

      <Toaster />
    </div>
  );
}