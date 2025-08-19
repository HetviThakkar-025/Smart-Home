import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PawPrint,
  Plus,
  RefreshCw,
  Activity,
  Heart,
  Utensils,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

export default function PetCareAssistant() {
  const [feedings, setFeedings] = useState([]);
  const [food, setFood] = useState("");
  const [notes, setNotes] = useState("");
  const [comfortScore, setComfortScore] = useState(null);
  const [comfortLevel, setComfortLevel] = useState(null);

  // Health anomaly detection
  const [symptoms, setSymptoms] = useState("");
  const [recentFood, setRecentFood] = useState("");
  const [recentActivity, setRecentActivity] = useState("");
  const [healthRisk, setHealthRisk] = useState(null);

  // Diet personalization
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [dietActivity, setDietActivity] = useState("");
  const [dietPlan, setDietPlan] = useState(null);

  const getPetCareTips = (comfort) => {
    switch (comfort) {
      case "comfortable":
        return "Your pet is feeling great! Keep up the regular feeding and environment conditions.";
      case "neutral":
        return "Your pet is okay but could be better. Consider offering a little more playtime or checking room temperature.";
      case "uncomfortable":
        return "Your pet might be stressed. Ensure proper hydration, adjust feeding schedule, and check for temperature extremes.";
      default:
        return "";
    }
  };

  const getPetHealthTips = (risk) => {
    switch (risk) {
      case "possible_dehydration":
        return "Your pet may be dehydrated. Ensure constant access to fresh water, monitor activity levels, and watch for excessive panting or lethargy.";
      case "possible_overfeeding":
        return "Your pet may be overfed. Review portion sizes, reduce treats, and increase play or walks to maintain a healthy weight.";
      case "possible_illness":
        return "Your pet may be unwell. Monitor closely for other symptoms and consult a veterinarian if the condition persists or worsens.";
      case "normal":
        return "Your pet appears healthy. Continue with balanced meals, adequate hydration, and regular activity.";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/api/petcare", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFeedings(res.data);
      } catch (error) {
        console.error("Error fetching feeding logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const addFeeding = async () => {
    if (!food) return;
    const newEntry = { food, notes, time: new Date().toLocaleString() };
    setFeedings([newEntry, ...feedings]);
    setFood("");
    setNotes("");

    try {
      await axios.post(
        "/api/petcare",
        {
          time: newEntry.time,
          food: newEntry.food,
          notes: newEntry.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error saving feeding log:", error);
    }
  };

  const refreshPrediction = async () => {
    try {
      const weatherRes = await axios.get("/api/weather");
      const { temp: temperature, humidity } = weatherRes.data;

      const logsRes = await axios.get("/api/petcare", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const logs = logsRes.data;

      let feeding_interval = 0;
      if (logs.length > 0) {
        const lastFeedingTime = new Date(logs[0].time);
        feeding_interval = Math.round(
          (Date.now() - lastFeedingTime.getTime()) / (1000 * 60 * 60)
        );
      }

      const activity_level = 7;

      const res = await axios.post(
        "/api/petcare/predict-comfort",
        { temperature, humidity, feeding_interval, activity_level },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const comfort = res.data.comfort_level;
      setComfortLevel(comfort);

      if (comfort === "comfortable") setComfortScore(90);
      else if (comfort === "neutral") setComfortScore(60);
      else setComfortScore(30);
    } catch (error) {
      console.error("Error fetching comfort prediction:", error);
      setComfortScore(null);
    }
  };

  const checkHealthRisk = async () => {
    try {
      const res = await axios.post(
        "/api/petcare/predict-health",
        { symptoms, recentFood, recentActivity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setHealthRisk(res.data.risk);
    } catch (err) {
      console.error("Error checking health risk:", err);
    }
  };

  const getDietRecommendation = async () => {
    try {
      const res = await axios.post(
        "/api/petcare/recommend-diet",
        { breed, weight, activity: dietActivity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDietPlan(res.data.recommendation);
    } catch (err) {
      console.error("Error getting diet plan:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-24 pb-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-pink-500/30">
              🐾
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pet Care Assistant
            </h1>
          </div>
          <p className="text-xl text-white/70 font-light">
            Track feedings, monitor comfort, and get AI tips for your furry
            friend
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Add Feeding */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 group hover:border-pink-400/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg shadow-lg shadow-pink-500/20">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Add Feeding</h2>
            </div>

            <input
              className="w-full mb-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              placeholder="Food (e.g., Dry Kibble - 30g)"
              value={food}
              onChange={(e) => setFood(e.target.value)}
            />
            <input
              className="w-full mb-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex gap-3">
              <motion.button
                onClick={addFeeding}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-pink-500/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Feeding
              </motion.button>
              <motion.button
                onClick={() => {
                  setFood("");
                  setNotes("");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 px-4 py-2 rounded-lg font-semibold border border-white/10 hover:bg-white/20 transition-all"
              >
                Clear
              </motion.button>
            </div>

            <hr className="my-4 border-white/10" />

            <h3 className="text-lg font-medium mb-2 text-white">Recent Logs</h3>
            {feedings.length === 0 ? (
              <p className="text-gray-400">No feedings yet.</p>
            ) : (
              <ul className="space-y-2">
                {feedings.map((f, i) => (
                  <li
                    key={i}
                    className="bg-white/5 p-3 rounded-lg border border-white/10"
                  >
                    <strong className="text-white">{f.food}</strong> -{" "}
                    {f.notes || "No notes"} <br />
                    <span className="text-gray-400 text-sm">{f.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Comfort Meter */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 group hover:border-blue-400/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg shadow-blue-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Comfort Meter
              </h2>
            </div>

            <p className="text-gray-400 mb-4">
              AI prediction based on feeding & environment.
            </p>

            <div className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {comfortScore !== null ? `${comfortScore}%` : "--"}
            </div>

            {comfortLevel && (
              <p className="text-md text-gray-300 italic mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                {getPetCareTips(comfortLevel)}
              </p>
            )}

            <motion.button
              onClick={refreshPrediction}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Prediction
            </motion.button>
          </motion.div>

          {/* Pet Tips */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 group hover:border-green-400/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow-lg shadow-green-500/20">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Pet Care Tips
              </h2>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <span className="text-gray-300">
                  Keep fresh water available 24/7
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <span className="text-gray-300">
                  Adjust feeding amount if comfort score is low
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <span className="text-gray-300">
                  Log symptoms like vomiting or lethargy
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <span className="text-gray-300">
                  Maintain a consistent feeding schedule
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <span className="text-gray-300">
                  Provide daily playtime and exercise
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Advanced Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Health Anomaly Detection */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 group hover:border-red-400/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-lg shadow-red-500/20">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Health Anomaly Detection
              </h2>
            </div>

            <p className="text-gray-400 mb-4">
              Enter your pet's recent symptoms, diet, and activities to check
              health risks.
            </p>

            <textarea
              className="w-full mb-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              placeholder="Symptoms (e.g., vomiting, low energy)..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
            />
            <input
              className="w-full mb-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              placeholder="Recent food intake (e.g., Biscuits - 50g)"
              value={recentFood}
              onChange={(e) => setRecentFood(e.target.value)}
            />
            <input
              className="w-full mb-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              placeholder="Recent activity level (1-10)"
              type="number"
              value={recentActivity}
              onChange={(e) => setRecentActivity(e.target.value)}
            />

            <motion.button
              onClick={checkHealthRisk}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 px-4 py-3 rounded-lg font-semibold shadow-lg hover:shadow-red-500/30 transition-all"
            >
              Check Health Risk
            </motion.button>

            {healthRisk && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-lg font-semibold text-red-400 mb-2">
                  RISK: {healthRisk.replace(/_/g, " ").toUpperCase()}
                </p>
                <p className="text-gray-300">{getPetHealthTips(healthRisk)}</p>
              </div>
            )}
          </motion.div>

          {/* Diet Personalization */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 group hover:border-green-400/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow-lg shadow-green-500/20">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Diet Personalization
              </h2>
            </div>

            <p className="text-gray-400 mb-4">
              Get AI-recommended portion size and food type tailored to your
              pet.
            </p>

            <input
              className="w-full mb-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="Breed (e.g., Labrador)"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
            <input
              className="w-full mb-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="Weight (kg)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <input
              className="w-full mb-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="Activity level (1-10)"
              type="number"
              value={dietActivity}
              onChange={(e) => setDietActivity(e.target.value)}
            />

            <motion.button
              onClick={getDietRecommendation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 px-4 py-3 rounded-lg font-semibold shadow-lg hover:shadow-green-500/30 transition-all"
            >
              Get Diet Plan
            </motion.button>

            {dietPlan && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-lg font-semibold text-green-400 mb-2">
                  Recommended Diet
                </p>
                <p className="text-gray-300">
                  Portion Size: {dietPlan.recommended_portion_g} g
                </p>
                <p className="text-gray-300">
                  Food Type:{" "}
                  {dietPlan.recommended_food_type
                    .replace(/_/g, " ")
                    .toUpperCase()}
                </p>
              </div>
            )}
          </motion.div>
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
