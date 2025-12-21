import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./features/auth/SignInForm";
import { SignUpForm } from "./features/auth/SignUpForm";
import { ForgotPasswordForm } from "./features/auth/ForgotPasswordForm";
import { SignOutButton } from "./features/auth/SignOutButton";
import { Toaster } from "sonner";
import { BusinessDashboard } from "./components/layout/BusinessDashboard";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Routes, Route } from "react-router-dom";

import { StaffLoginForm } from "./features/auth/StaffLoginForm";
import { StaffDashboard } from "./features/staff/StaffDashboard";
import { StaffDashboardSkeleton } from "./features/staff/StaffDashboardSkeleton";

export default function App() {
  const [authView, setAuthView] = useState<'signIn' | 'signUp' | 'forgotPassword' | 'staffLogin'>('signIn');
  const [staffUser, setStaffUser] = useState<any | null>(null);
  const [staffToken, setStaffToken] = useState<string | null>(localStorage.getItem('staff_session_token'));

  // Validate session if token exists
  const validatedStaff = useQuery(api.staff.validateSession, staffToken ? { token: staffToken } : "skip");
  const isStaffLoading = staffToken !== null && validatedStaff === undefined;

  useEffect(() => {
    if (validatedStaff) {
      setStaffUser(validatedStaff);
    } else if (staffToken && validatedStaff === null) {
      // Token invalid or expired
      localStorage.removeItem('staff_session_token');
      setStaffToken(null);
      setStaffUser(null);
    }
  }, [validatedStaff, staffToken]);

  const AuthForm = () => {
    if (authView === 'signUp') {
      return <SignUpForm onSwitchToSignIn={() => setAuthView('signIn')} />;
    }
    if (authView === 'forgotPassword') {
      return <ForgotPasswordForm onSwitchToSignIn={() => setAuthView('signIn')} />;
    }
    if (authView === 'staffLogin') {
      return <StaffLoginForm
        onSwitchToBusinessLogin={() => setAuthView('signIn')}
        onLogin={(user) => setStaffUser(user)}
      />;
    }
    return <SignInForm
      onSwitchToSignUp={() => setAuthView('signUp')}
      onSwitchToForgotPassword={() => setAuthView('forgotPassword')}
      onSwitchToStaffLogin={() => setAuthView('staffLogin')}
    />;
  };

  return (
    <ThemeProvider>
      {isStaffLoading ? (
        <StaffDashboardSkeleton />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-card dark:text-dark-text">
          <Authenticated>
            <Routes>
              <Route path="/" element={<BusinessDashboard />} />
              <Route path="/:module" element={<BusinessDashboard />} />
            </Routes>
          </Authenticated>

          <Unauthenticated>
            {staffUser ? (
              <StaffDashboard
                staffUser={staffUser}
                onLogout={() => {
                  localStorage.removeItem('staff_session_token');
                  setStaffToken(null);
                  setStaffUser(null);
                  setAuthView('staffLogin');
                }}
              />
            ) : (
              <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Runi</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your business operations efficiently</p>
                  </div>
                  <AuthForm />
                </div>
              </div>
            )}
          </Unauthenticated>

          <Toaster position="top-right" richColors />
        </div>
      )}
    </ThemeProvider>
  );
}