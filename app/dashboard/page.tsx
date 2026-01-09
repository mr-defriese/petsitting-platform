"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Client Dashboard</h1>
      <p className="mt-2 opacity-70">Welcome back, {email}</p>

      <div className="mt-8 grid gap-4">
        <a className="border p-4 rounded-lg" href="/pets">
          🐾 Manage Pets
        </a>

        <a className="border p-4 rounded-lg" href="/book">
          📅 Book a Stay
        </a>

        <a className="border p-4 rounded-lg" href="/bookings">
          📖 My Bookings
        </a>
      </div>
    </main>
  );
}
