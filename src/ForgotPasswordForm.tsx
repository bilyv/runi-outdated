import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
    const { signIn } = useAuthActions();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            formData.append("flow", "reset");
            await signIn("password", formData);
            toast.success("Password reset link sent! Check your email.");
            onSwitchToSignIn();
        } catch (error) {
            console.error("Authentication error:", error);
            toast.error("Failed to send reset link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 text-center">
                    Reset Password
                </h2>
                <p className="text-sm text-gray-500 text-center mt-1">
                    Enter your email to receive a password reset link
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                        Business Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="auth-input-field text-sm"
                        placeholder="your@business.com"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="auth-button text-sm py-2"
                    disabled={loading}
                >
                    {loading
                        ? "Sending..."
                        : "Send Reset Link"}
                </button>
            </form>

            <div className="mt-4 text-center">
                <button
                    type="button"
                    onClick={onSwitchToSignIn}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                    Back to Sign In
                </button>
            </div>
        </div>
    );
}
