// src/components/petcare/AddFeedingForm.jsx
import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AddFeedingForm({
  onAdded = () => {},
  apiBase = API_BASE,
}) {
  const [food, setFood] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!food.trim()) return;
    try {
      setIsSaving(true);
      // backend will set time / createdAt
      const res = await axios.post(`${apiBase}/api/pet-care`, {
        food: food.trim(),
        notes: notes.trim(),
      });
      setFood("");
      setNotes("");
      onAdded(res.data);
    } catch (err) {
      console.error("Add feeding failed:", err?.response?.data || err.message);
      alert("Failed to add feeding. See console.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={food}
        onChange={(e) => setFood(e.target.value)}
        placeholder="Food (e.g., Dry Kibble - 30g)"
        className="w-full p-3 rounded-xl bg-white/6 border border-white/6 placeholder-gray-400 focus:outline-none"
      />
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="w-full p-3 rounded-xl bg-white/6 border border-white/6 placeholder-gray-400 focus:outline-none"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className={`px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white ${
            isSaving ? "opacity-70" : ""
          }`}
        >
          {isSaving ? "Saving…" : "Add Feeding"}
        </button>

        <button
          type="button"
          onClick={() => {
            setFood("");
            setNotes("");
          }}
          className="px-4 py-2 rounded-xl border border-white/10 text-gray-200 hover:bg-white/5"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
