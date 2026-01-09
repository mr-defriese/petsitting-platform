"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) return setMsg(error.message);

    setMsg("Account created! Check your email to confirm, then log in.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>

        <form onSubmit={onSignup} className="mt-6 space-y-3">
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
            placeholder="Password (min 6 chars)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full border rounded-lg p-3 font-medium" disabled={loading} type="submit">
            {loading ? "Creating..." : "Create account"}
          </button>

          {msg && <p className="text-sm mt-2">{msg}</p>}
        </form>

        <p className="text-sm mt-4">
          Already have an account? <Link className="underline" href="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
