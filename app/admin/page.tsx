"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function checkAdmin() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    setIsAdmin(profile?.role === "admin");
  }

  async function loadBookings() {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    setBookings(data || []);
  }

  async function setStatus(id: string, status: string) {
    setMsg(null);
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) setMsg(error.message);
    else loadBookings();
  }

  useEffect(() => {
    (async () => {
      await checkAdmin();
      await loadBookings();
    })();
  }, []);

  if (!isAdmin) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-2 opacity-70">Not authorized.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="opacity-70 mt-1">Approve or reject booking requests.</p>

      {msg && <p className="mt-4">{msg}</p>}

      <div className="mt-6 space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="border rounded p-4">
            <p><strong>Dates:</strong> {b.start_date} → {b.end_date}</p>
            <p><strong>Frequency:</strong> {b.visit_frequency}</p>
            <p><strong>Status:</strong> {b.status}</p>

            <div className="mt-3 flex gap-2">
              <button className="border rounded px-3 py-2"
                onClick={() => setStatus(b.id, "approved")}>
                Approve
              </button>
              <button className="border rounded px-3 py-2"
                onClick={() => setStatus(b.id, "rejected")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
