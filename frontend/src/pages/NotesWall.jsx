import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function NotesWall() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const userId = localStorage.getItem("userId"); // or wherever you store logged-in user id

  useEffect(() => {
    if (userId) {
      console.log(userId);
      fetchNotes();
    } else {
      console.error("No userId found in localStorage!");
    }
  }, [userId]);

  const fetchNotes = async () => {
    const res = await axios.get(`/api/notes/${userId}`);
    console.log("Fetched notes:", res.data); // see what exactly comes
    setNotes(Array.isArray(res.data) ? res.data : []);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const res = await axios.post("/api/notes", { userId, content: newNote });
    setNotes([res.data, ...notes]);
    setNewNote("");
  };

  const deleteNote = async (id) => {
    await axios.delete(`/api/notes/${id}`);
    setNotes(notes.filter((note) => note._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
      <h1 className="text-3xl font-bold text-center text-white mb-8 mt-10">
        📝 Smart Note & Reminder Wall
      </h1>
      <div className="max-w-xl mx-auto">
        <div className="flex mb-4">
          <input
            className="flex-1 px-4 py-2 rounded-l-xl bg-slate-700 text-white"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note..."
          />
          <button
            onClick={addNote}
            className="px-4 py-2 rounded-r-xl bg-purple-600 text-white hover:bg-purple-700"
          >
            Add
          </button>
        </div>
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="relative p-4 rounded-2xl bg-slate-800/60 border border-purple-500/20 
             backdrop-blur-sm shadow-md hover:shadow-purple-600/40 
             transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium">{note.content}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs font-semibold uppercase rounded-full px-2 py-0.5 
        ${
          note.urgency === "urgent"
            ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow shadow-red-500/30"
            : note.urgency === "later"
            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 shadow shadow-yellow-500/30"
            : "bg-green-500/20 text-green-400 border border-green-500/40 shadow shadow-green-500/30"
        }
        backdrop-blur-sm transition-all duration-300`}
                >
                  {note.urgency}
                </span>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✖
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
