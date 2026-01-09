"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Pet = {
  id: string;
  name: string;
  breed: string | null;
  age: number | null;
  feeding_schedule: string | null;
  medications: string | null;
  notes: string | null;
};

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function loadPets() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setPets(data || []);
  }

  async function addPet(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMsg("You must be logged in.");
      return;
    }

    if (!name) {
      setMsg("Pet name is required.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("pets").insert({
      owner_id: user.id,
      name,
      breed,
      age: age ? parseInt(age) : null,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
    } else {
      setName("");
      setBreed("");
      setAge("");
      loadPets();
    }
  }

  async function deletePet(id: string) {
    await supabase.from("pets").delete().eq("id", id);
    loadPets();
  }

  useEffect(() => {
    loadPets();
  }, []);

  return (
    <main className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold">My Pets</h1>
      <p className="opacity-70 mt-1">Manage your pets for booking stays.</p>

      {/* Add Pet Form */}
      <form onSubmit={addPet} className="mt-6 space-y-3 border rounded-lg p-6">
        <h2 className="text-xl font-semibold">Add a Pet</h2>

        <input
          className="border rounded p-3 w-full"
          placeholder="Pet name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border rounded p-3 w-full"
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />

        <input
          className="border rounded p-3 w-full"
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button
          className="border rounded p-3 w-full font-medium"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Pet"}
        </button>

        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>

      {/* Pet List */}
      <div className="mt-8 space-y-4">
        {pets.map((pet) => (
          <div key={pet.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">🐾 {pet.name}</p>
              {pet.breed && <p className="text-sm opacity-70">Breed: {pet.breed}</p>}
              {pet.age && <p className="text-sm opacity-70">Age: {pet.age}</p>}
            </div>

            <button
              onClick={() => deletePet(pet.id)}
              className="border rounded px-3 py-2 text-sm"
            >
              Delete
            </button>
          </div>
        ))}

        {pets.length === 0 && (
          <p className="opacity-70">No pets added yet.</p>
        )}
      </div>
    </main>
  );
}


