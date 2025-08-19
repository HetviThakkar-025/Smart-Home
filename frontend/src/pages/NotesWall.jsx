import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";

export default function NotesWall() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchNotes();
    } else {
      console.error("No userId found in localStorage!");
    }
  }, [userId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/notes/${userId}`);
      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    setAdding(true);
    try {
      const res = await axios.post("/api/notes", { userId, content: newNote });
      setNotes([res.data, ...notes]);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setAdding(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-24 pb-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30">
              📝
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Notes Wall
            </h1>
          </div>
          <p className="text-xl text-white/70 font-light">
            Your personal AI-powered note and reminder system
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Add Note Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex group">
            <input
              className="flex-1 px-6 py-4 rounded-l-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note or reminder..."
              onKeyPress={(e) => e.key === "Enter" && addNote()}
            />
            <motion.button
              onClick={addNote}
              disabled={adding || !newNote.trim()}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-4 rounded-r-2xl font-semibold transition-all flex items-center justify-center ${
                adding || !newNote.trim()
                  ? "bg-gray-700/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/30"
              }`}
            >
              {adding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Notes List */}
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No notes yet</p>
              <p className="text-sm mt-2">Add your first note above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {notes.map((note) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 hover:border-purple-400/30 transition-all duration-500 group"
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-opacity duration-500"></div>

                    <div className="relative z-10 flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-medium text-lg">
                          {note.content}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 ml-4">
                        <span
                          className={`text-xs font-semibold uppercase rounded-full px-3 py-1 backdrop-blur-sm transition-all duration-300 ${
                            note.urgency === "urgent"
                              ? "bg-red-600/20 text-red-300 border border-red-600/30"
                              : note.urgency === "later"
                              ? "bg-yellow-600/20 text-yellow-300 border border-yellow-600/30"
                              : "bg-green-600/20 text-green-300 border border-green-600/30"
                          }`}
                        >
                          {note.urgency}
                        </span>
                        <motion.button
                          onClick={() => deleteNote(note._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
