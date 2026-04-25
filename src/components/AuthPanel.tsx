"use client";

import { FormEvent, useState } from "react";
import { useBoardStore } from "@/store/useBoardStore";

type AuthMode = "login" | "register";

export function AuthPanel() {
  const registerUser = useBoardStore((state) => state.registerUser);
  const loginUser = useBoardStore((state) => state.loginUser);
  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = mode === "register"
      ? await registerUser({ name, email, password })
      : await loginUser({ email, password });

    setLoading(false);

    if (!result.ok && !result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }

    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1200px] gap-6 lg:grid-cols-[minmax(0,1.2fr)_420px]">
        <section className="relative overflow-hidden rounded-[2rem] border border-[rgba(8,17,79,0.08)] bg-[rgba(255,255,255,0.42)] p-8 shadow-[var(--slate-shadow)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(226,189,244,0.18),transparent_24%)]" />
          <div className="relative space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--slate-navy)]/68">
              Slate
            </p>
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--slate-navy)] sm:text-5xl">
                Sign in to keep your board, progress, and completed work history.
              </h1>
              <p className="text-sm leading-7 text-[var(--slate-navy)]/72 sm:text-base">
                Each user gets a persistent board, a login, and a removable archive of completed tasks.
              </p>
            </div>
          </div>
        </section>

        <form
          className="rounded-[2rem] border border-white/30 bg-[var(--slate-panel-strong)] p-6 shadow-[0_20px_60px_rgba(5,20,71,0.28)]"
          onSubmit={handleSubmit}
        >
          <div className="space-y-5">
            <div className="flex rounded-full bg-white/8 p-1">
              <button
                type="button"
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-[var(--slate-blue)] text-[var(--slate-navy)]"
                    : "text-white/72"
                }`}
                onClick={() => setMode("register")}
              >
                Create Account
              </button>
              <button
                type="button"
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-[var(--slate-blue)] text-[var(--slate-navy)]"
                    : "text-white/72"
                }`}
                onClick={() => setMode("login")}
              >
                Log In
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">
                {mode === "register" ? "Create your Slate account" : "Welcome back"}
              </p>
              <p className="text-sm leading-6 text-white/70">
                {mode === "register"
                  ? "Create an account to save your boards and progress history."
                  : "Sign in to access your boards and history."}
              </p>
            </div>

            {mode === "register" ? (
              <label className="space-y-2 text-sm text-white/78">
                <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slate-blue-soft)]">
                  Name
                </span>
                <input
                  aria-label="Name"
                  className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--slate-blue)]"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
            ) : null}

            <label className="space-y-2 text-sm text-white/78">
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slate-blue-soft)]">
                Email
              </span>
              <input
                aria-label="Email"
                className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--slate-blue)]"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="space-y-2 text-sm text-white/78">
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--slate-blue-soft)]">
                Password
              </span>
              <input
                aria-label="Password"
                className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--slate-blue)]"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--slate-blue)] px-5 text-sm font-semibold text-[var(--slate-navy)] transition hover:scale-[1.01] hover:bg-[var(--slate-blue-soft)] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--slate-navy)]" />
                  {mode === "register" ? "Creating account..." : "Signing in..."}
                </span>
              ) : (
                mode === "register" ? "Create Account" : "Log In"
              )}
            </button>

            {error ? <p className="text-sm text-[#ffe08a]">{error}</p> : null}
          </div>
        </form>
      </div>
    </main>
  );
}