"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestPage() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    supabase.auth.getSession().then(({ error }) => {
      setStatus(error ? `Error: ${error.message}` : "Supabase connected ✅");
    });
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Supabase Test</h1>
      <p className="mt-3">{status}</p>
    </main>
  );
}
