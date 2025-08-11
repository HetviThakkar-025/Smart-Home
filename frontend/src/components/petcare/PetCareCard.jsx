// src/components/petcare/PetCareCard.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AddFeedingForm from "./AddFeedingForm";
import FeedingLog from "./FeedingLog";
import ComfortMeter from "./ComfortMeter";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function PetCareCard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comfort, setComfort] = useState(null); // { score: number, recommended: bool }
  const [env, setEnv] = useState({ temperature: null, humidity: null });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/pet-care`);
      // expected: array of logs with { _id, time or createdAt, food, notes }
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(
        "Failed to fetch pet logs:",
        err?.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnvironment = useCallback(async () => {
    try {
      // optional endpoint - your existing weather API. adapt if shape differs.
      const res = await axios.get(`${API_BASE}/api/weather`);
      // Expect res.data: { tempC: number, humidity: number } or similar
      const payload = res.data || {};
      // try multiple shapes
      const temperature =
        payload.tempC ??
        payload.temperature ??
        payload.temp ??
        payload.main?.temp ??
        null;
      const humidity =
        payload.humidity ?? payload.h ?? payload.main?.humidity ?? null;
      setEnv({ temperature, humidity });
    } catch (err) {
      console.warn("Env fetch failed (ok to ignore):", err?.message || err);
      setEnv({ temperature: null, humidity: null });
    }
  }, []);

  // compute hours since last feeding
  const computeLastFeedingHours = useCallback(() => {
    if (!logs || logs.length === 0) return 24;
    const sorted = [...logs].sort(
      (a, b) =>
        new Date(b.createdAt || b.time) - new Date(a.createdAt || a.time)
    );
    const last = sorted[0];
    const lastDate = new Date(last.createdAt || last.time);
    const diffHours = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60);
    return Math.max(0, Number(diffHours.toFixed(2)));
  }, [logs]);

  const fetchComfortPrediction = useCallback(async () => {
    try {
      const lastHours = computeLastFeedingHours();
      const payload = {
        last_feeding_hours: lastHours,
        temperature: env.temperature ?? null,
        humidity: env.humidity ?? null,
      };

      const res = await axios.post(
        `${API_BASE}/api/pet-care-ai/predict`,
        payload
      );
      // expecting { comfort_score: number } or { comfort_score: x, recommended_feed: bool }
      const data = res.data || {};
      const score = data.comfort_score ?? data.comfort ?? data.score ?? null;
      const recommended =
        data.recommended_feed ?? (score !== null ? score < 60 : false);

      setComfort({
        score: score !== null ? Math.round(score) : null,
        recommended,
      });
    } catch (err) {
      console.error("Prediction failed:", err?.response?.data || err.message);
      setComfort(null);
    }
  }, [computeLastFeedingHours, env]);

  useEffect(() => {
    fetchLogs();
    fetchEnvironment();
  }, [fetchLogs, fetchEnvironment]);

  // refetch prediction whenever logs or env change
  useEffect(() => {
    fetchComfortPrediction();
  }, [logs, env, fetchComfortPrediction]);

  const handleAdd = async (newLog) => {
    // newLog is expected to already have been saved on backend
    await fetchLogs();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/pet-care/${id}`);
      await fetchLogs();
    } catch (err) {
      console.error("Delete failed:", err?.response?.data || err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column: Add + Logs */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1"
      >
        <div className="backdrop-blur bg-white/5 border border-white/6 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Add Feeding</h3>
          <AddFeedingForm onAdded={handleAdd} apiBase={API_BASE} />
          <hr className="my-4 border-white/6" />
          <h4 className="text-lg font-medium mb-2">Recent Logs</h4>
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <FeedingLog logs={logs} onDelete={handleDelete} />
          )}
        </div>
      </motion.div>

      {/* Center column: comfort meter */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="lg:col-span-1"
      >
        <div className="backdrop-blur bg-white/5 border border-white/6 rounded-2xl p-6 shadow-lg h-full flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-3">Comfort Meter</h3>
            <p className="text-sm text-gray-300 mb-4">
              Prediction based on last feeding and room conditions.
            </p>
            <ComfortMeter
              comfort={comfort}
              lastHours={computeLastFeedingHours()}
            />
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-300">
              Current environment:{" "}
              <span className="text-white">
                {env.temperature ? `${env.temperature}°C` : "—"} ·{" "}
                {env.humidity ? `${env.humidity}%` : "—"}
              </span>
            </p>

            <div className="mt-3 flex gap-2">
              <button
                className="px-3 py-2 rounded-lg bg-cyan-600/90 hover:bg-cyan-700 transition"
                onClick={() => {
                  fetchEnvironment();
                  fetchComfortPrediction();
                }}
              >
                Refresh Prediction
              </button>
              <button
                className="px-3 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 transition"
                onClick={() => {
                  // navigate or show help; simple pointer for now
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Help
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right column: large info (tips, history or big card) */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="lg:col-span-1"
      >
        <div className="backdrop-blur bg-white/5 border border-white/6 rounded-2xl p-6 shadow-lg h-full flex flex-col">
          <h3 className="text-xl font-semibold mb-3">Pet Care Tips</h3>

          <ul className="space-y-3 text-gray-300">
            <li>• Keep fresh water available 24/7.</li>
            <li>• Adjust feeding amount if comfort score is low.</li>
            <li>
              • Use scheduled auto-feeder integration later for automation.
            </li>
            <li>• Log any symptoms (vomit, lethargy) under notes.</li>
          </ul>

          <div className="mt-auto pt-6 text-sm text-gray-400">
            Tip: you can enable notifications later to get reminders.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
