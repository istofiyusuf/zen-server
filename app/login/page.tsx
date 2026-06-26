"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useToastStore } from "@/lib/toast-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      addToast("success", "Welcome back!", "Login successful");
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (submitted || isLoading) return;
    if (!username || !password) return;

    clearError();
    setSubmitted(true);

    try {
      await login(username.trim(), password);
      // Toast will show via useEffect when isAuthenticated changes
    } catch (err: any) {
      addToast("error", "Login failed", err.message || "Invalid credentials");
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">Z</span>
          </div>
          <h1 className="text-xl font-semibold text-primary">Welcome back</h1>
          <p className="text-sm text-secondary mt-1">Sign in to Zen Server</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Error Alert */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-xl p-4">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label htmlFor="login-username" className="text-sm text-secondary mb-2 block">
              Username or Email
            </label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) clearError();
              }}
              className="input"
              placeholder="Enter username or email"
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="login-password" className="text-sm text-secondary mb-2 block">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) clearError();
              }}
              className="input"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || submitted || !username || !password}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || submitted ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-secondary">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Register Link */}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="btn btn-secondary w-full"
          disabled={isLoading}
        >
          Create new account
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
