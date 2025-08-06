import React, { useEffect, useState } from "react";
import { Target } from "lucide-react";
import axios from "axios";

export default function FocusCard() {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFocusNote = async () => {
      try {
        const res = await axios.get("/api/focus", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.notes && res.data.notes.length > 0) {
          console.log(res.data.notes[0]);
          setNote(res.data.notes[0]); // show latest urgent note
        } else {
          setNote(null);
        }
      } catch (err) {
        console.error("Error fetching focus note:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFocusNote();
  }, []);

  return (
    <div className="w-full h-[250px] max-w-md flex flex-col justify-between backdrop-blur-lg bg-white/5 border border-white/10 hover:scale-[1.03] transition-transform duration-300 ease-out rounded-2xl shadow-2xl p-6 overflow-hidden">
      <div className="flex items-center mb-3">
        <Target className="text-green-400 mr-2" />
        <h2 className="text-xl font-semibold">Today’s Focus</h2>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : note ? (
        <>
          <p className="text-lg text-gray-200">{note.content}</p>
          <p className="text-sm text-gray-400 mt-1">
            Stay consistent and avoid distractions 🚀
          </p>
        </>
      ) : (
        <p className="text-gray-400">No urgent focus note for today</p>
      )}
    </div>
  );
}
