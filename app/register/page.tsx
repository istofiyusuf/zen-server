"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useToastStore } from "@/lib/toast-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Redirect jika sudah login
   useEffect(() => {
    if (isAuthenticated) {
      addToast("success", "Account created!", "Welcome to Zen Server");
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    // Cegah default form submit
    e.preventDefault();
    e.stopPropagation();

    // Cegah double submit
    if (submitted || isLoading) {
      return;
    }

    setValidationError("");
    clearError();

    // Validasi username
    if (!username || username.trim().length < 3) {
      setValidationError("Username must be at least 3 characters");
      return;
    }

    // Validasi email
    if (!email || !email.includes("@")) {
      setValidationError("Please enter a valid email address");
      return;
    }

    // Validasi password
    if (!password || password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    // Validasi konfirmasi password
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    setSubmitted(true);

    try {
      await register(username.trim(), email.trim(), password);
      router.push("/dashboard");
    } catch (err: any) {
      addToast("error", "Registration failed", err.message);
      setSubmitted(false);
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">Z</span>
          </div>
          <h1 className="text-xl font-semibold text-primary">Create Account</h1>
          <p className="text-sm text-secondary mt-1">Set up your Zen Server</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Error Alert */}
          {displayError && (
            <div className="bg-error/10 border border-error/20 rounded-xl p-4">
              <p className="text-sm text-error">{displayError}</p>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label htmlFor="reg-username" className="text-sm text-secondary mb-2 block">
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setValidationError("");
              }}
              className="input"
              placeholder="Choose a username"
              required
              minLength={3}
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="reg-email" className="text-sm text-secondary mb-2 block">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError("");
              }}
              className="input"
              placeholder="your@email.com"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="reg-password" className="text-sm text-secondary mb-2 block">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationError("");
              }}
              className="input"
              placeholder="Min. 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="reg-confirm" className="text-sm text-secondary mb-2 block">
              Confirm Password
            </label>
            <input
              id="reg-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setValidationError("");
              }}
              className="input"
              placeholder="Repeat your password"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || submitted}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || submitted ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-secondary">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Login Link */}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="btn btn-secondary w-full"
          disabled={isLoading}
        >
          Already have an account? Sign in
        </button>

        {/* Back to Home */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full text-center text-sm text-secondary mt-4 hover:text-primary transition-colors"
          disabled={isLoading}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
