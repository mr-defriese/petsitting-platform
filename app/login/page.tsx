"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) return setMsg(error.message);
    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <p className="text-sm opacity-70 mt-1">Access your bookings and pet profiles.</p>

        <form onSubmit={onLogin} className="mt-6 space-y-3">
          <input
            className="w-full border rounded-lg p-3"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border rounded-lg p-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full border rounded-lg p-3 font-medium"
            disabled={loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {msg && <p className="text-sm mt-2">{msg}</p>}
        </form>

        <p className="text-sm mt-4">
          New here? <Link className="underline" href="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
