"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const isRegistering = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const result = isRegistering
        ? await authClient.signUp.email({
            name: name.trim(),
            email: email.trim(),
            password,
          })
        : await authClient.signIn.email({
            email: email.trim(),
            password,
          });

      if (result.error) {
        setError(result.error.message ?? "Authentication failed.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-12 bg-[radial-gradient(circle_at_center,var(--ds-accent-muted),transparent_68%)] opacity-50 blur-2xl"
      />

      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/20">
          <div className="border-b border-border px-6 py-6 sm:px-8">
            <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent-muted/40 px-2.5 py-1 text-[11px] font-medium text-accent">
              {isRegistering
                ? "Start building your knowledge base"
                : "Welcome back to your workspace"}
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary">
              {isRegistering ? "Create your account" : "Welcome back"}
            </h1>

            <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
              {isRegistering
                ? "Keep your technical notes, questions, snippets, and ideas organized in one private workspace."
                : "Pick up where you left off and continue building your technical knowledge."}
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegistering && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-primary"
                  >
                    Name
                  </label>

                  <div className="relative mt-2">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                    >
                      <path
                        d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.25 5.5c.55-2.05 2.28-3.25 5.25-3.25s4.7 1.2 5.25 3.25"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent/30"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-primary"
                >
                  Email
                </label>

                <div className="relative mt-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                  >
                    <path
                      d="M3.75 5.75h12.5v8.5H3.75v-8.5Zm.5.5L10 10.5l5.75-4.25"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent/30"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-text-primary"
                  >
                    Password
                  </label>

                  {!isRegistering && (
                    <span className="text-xs text-text-muted">
                      Minimum 8 characters
                    </span>
                  )}
                </div>

                <div className="relative mt-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                  >
                    <rect
                      x="4"
                      y="8"
                      width="12"
                      height="8"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M6.75 8V6.5a3.25 3.25 0 0 1 6.5 0V8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={
                      isRegistering ? "new-password" : "current-password"
                    }
                    minLength={8}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent/30"
                  />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-red-500/20 bg-red-500/[0.04] px-3.5 py-3"
                >
                  <div className="flex items-start gap-2.5">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="7"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M10 6.75v3.75M10 13.25v.01"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    <p className="text-sm leading-5 text-red-400">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting
                    ? isRegistering
                      ? "Creating account..."
                      : "Signing in..."
                    : isRegistering
                      ? "Create account"
                      : "Sign in"}

                  {!isSubmitting && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    >
                      <path
                        d="M4 10h11M10.5 5.5 15 10l-4.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </button>
            </form>
          </div>

          <div className="border-t border-border bg-background/40 px-6 py-4 sm:px-8">
            <p className="text-center text-sm text-text-muted">
              {isRegistering ? (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    Create one
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-text-muted">
          Private workspace
          <span aria-hidden="true">·</span>
          Built for developers
        </div>
      </div>
    </div>
  );
}
