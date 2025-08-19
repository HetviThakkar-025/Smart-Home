import React, { useEffect, useState } from "react";
import { Target, Rocket } from "lucide-react";
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
    <div className="relative w-full h-full flex flex-col justify-between backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10 hover:border-green-400/30 rounded-3xl p-6 overflow-hidden transition-all duration-500 group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg shadow-lg shadow-green-500/20 mr-3">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Today's Focus</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-pulse text-gray-400">
              Loading your focus...
            </div>
          </div>
        ) : note ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-200 group-hover:text-white transition-colors">
              {note.content}
            </p>
            <div className="flex items-center mt-4">
              <Rocket className="w-5 h-5 text-emerald-300 mr-2" />
              <p className="text-sm text-gray-400 group-hover:text-emerald-200 transition-colors">
                Stay consistent and avoid distractions
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-20 text-center">
            <p className="text-gray-400 group-hover:text-green-200 transition-colors">
              No urgent focus note for today
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Add one in your notes section
            </p>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      {note && (
        <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <Target className="w-16 h-16 text-emerald-400" />
        </div>
      )}
    </div>
  );
}
