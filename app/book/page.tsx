"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState("");
  const [instructions, setInstructions] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMsg("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      owner_id: user.id,
      start_date: startDate,
      end_date: endDate,
      visit_frequency: frequency,
      instructions,
      emergency_contact: emergencyContact,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Booking request submitted! Awaiting approval.");
      setStartDate("");
      setEndDate("");
      setFrequency("");
      setInstructions("");
      setEmergencyContact("");
    }
  }

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold">Book a Stay</h1>
      <p className="opacity-70 mt-1">Request pet sitting for your travel dates.</p>

      <form onSubmit={submitBooking} className="mt-6 space-y-4">
        <div>
          <label>Start Date</label>
          <input
            className="border rounded p-2 w-full"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>End Date</label>
          <input
            className="border rounded p-2 w-full"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Visit Frequency</label>
          <input
            className="border rounded p-2 w-full"
            placeholder="Example: 2 visits per day"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Care Instructions</label>
          <textarea
            className="border rounded p-2 w-full"
            rows={4}
            placeholder="Feeding, meds, behavior notes..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <div>
          <label>Emergency Contact</label>
          <input
            className="border rounded p-2 w-full"
            placeholder="Name & phone number"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
          />
        </div>

        <button className="border rounded p-3 w-full font-medium">
          Submit Booking Request
        </button>

        {msg && <p className="mt-3">{msg}</p>}
      </form>
    </main>
  );
}
