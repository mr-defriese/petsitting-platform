"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);

  async function loadBookings() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    setBookings(data || []);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      <div className="mt-6 space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="border rounded p-4">
            <p>
              <strong>Dates:</strong> {b.start_date} → {b.end_date}
            </p>
            <p>
              <strong>Frequency:</strong> {b.visit_frequency}
            </p>
            <p>
              <strong>Status:</strong> {b.status}
            </p>
          </div>
        ))}

        {bookings.length === 0 && (
          <p className="opacity-70">No bookings yet.</p>
        )}
      </div>
    </main>
  );
}
