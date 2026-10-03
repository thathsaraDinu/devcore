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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
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
    <div className="w-full max-w-md">
      <div className="mb-8">
        <p className="text-sm font-medium text-accent">
          DevCore
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          {isRegistering ? "Create your account" : "Welcome back"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {isRegistering
            ? "Create an account to keep your developer knowledge private and organized."
            : "Sign in to access your developer knowledge workspace."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegistering && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-text-primary"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-primary"
          >
            Password
          </label>

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
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="text-sm text-red-400"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? isRegistering
              ? "Creating account..."
              : "Signing in..."
            : isRegistering
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        {isRegistering ? (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-text-secondary transition-colors hover:text-text-primary"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-text-secondary transition-colors hover:text-text-primary"
            >
              Create one
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
