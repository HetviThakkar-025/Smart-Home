import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
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
        setFeedings(res.data); // assuming backend returns an array of logs
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
      // 1. Get real weather data from your backend weather route
      const weatherRes = await axios.get("/api/weather");
      const { temp: temperature, humidity } = weatherRes.data;

      // 2. Get feeding logs for logged-in user
      const logsRes = await axios.get("/api/petcare", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const logs = logsRes.data;

      // 3. Calculate feeding interval in hours from latest log
      let feeding_interval = 0;
      if (logs.length > 0) {
        const lastFeedingTime = new Date(logs[0].time);
        feeding_interval = Math.round(
          (Date.now() - lastFeedingTime.getTime()) / (1000 * 60 * 60)
        );
      }

      // 4. Activity level could be static for now, later from sensor/device
      const activity_level = 7;

      // 5. Send to Node backend → Python model
      const res = await axios.post(
        "/api/petcare/predict-comfort",
        { temperature, humidity, feeding_interval, activity_level },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const comfort = res.data.comfort_level;
      setComfortLevel(comfort);

      // 6. Convert label to score
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
      console.log(res.data.risk);
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
      console.log(res.data);
      setDietPlan(res.data.recommendation);
    } catch (err) {
      console.error("Error getting diet plan:", err);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-[#0e1628] to-[#1a2238] text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="text-center mb-8 mt-10">
        <motion.h1
          className="text-5xl font-bold flex items-center justify-center gap-3"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <PawPrint className="text-pink-400 w-10 h-10" />
          Pet Care Assistant 🐾
        </motion.h1>
        <p className="text-lg text-gray-300 mt-7 font-semibold">
          🐱 Track feedings, monitor comfort, and get AI tips for your furry
          friend 🐶
        </p>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Add Feeding */}
        <motion.div
          className="bg-[#131b2e] p-6 rounded-2xl shadow-lg hover:shadow-pink-400/30 transition-all mt-5"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-2xl font-semibold mb-4">🍖 Add Feeding</h2>
          <input
            className="w-full mb-3 p-3 rounded-lg bg-[#0f1424] text-white"
            placeholder="Food (e.g., Dry Kibble - 30g)"
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />
          <input
            className="w-full mb-3 p-3 rounded-lg bg-[#0f1424] text-white"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              onClick={addFeeding}
              className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-lg hover:scale-105 transition-all"
            >
              Add Feeding
            </button>
            <button
              onClick={() => {
                setFood("");
                setNotes("");
              }}
              className="bg-gray-700 px-4 py-2 rounded-lg hover:scale-105 transition-all"
            >
              Clear
            </button>
          </div>
          <hr className="my-4 border-gray-600" />
          <h3 className="text-lg font-medium mb-2">📜 Recent Logs</h3>
          {feedings.length === 0 ? (
            <p className="text-gray-400">No feedings yet.</p>
          ) : (
            <ul className="space-y-2">
              {feedings.map((f, i) => (
                <li key={i} className="bg-[#0f1424] p-2 rounded-md">
                  <strong>{f.food}</strong> - {f.notes || "No notes"} <br />
                  <span className="text-gray-400 text-sm">{f.time}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Comfort Meter */}
        <motion.div
          className="bg-[#131b2e] p-6 rounded-2xl shadow-lg hover:shadow-pink-400/30 transition-all mt-5"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-2xl font-semibold mb-4">🌡 Comfort Meter</h2>
          <p className="text-gray-400 mb-2">
            AI prediction based on feeding & environment.
          </p>
          <div className="text-4xl font-bold text-pink-400 mb-4 mt-4">
            {comfortScore !== null ? `${comfortScore}%` : "--"}
          </div>

          {comfortLevel && (
            <p className="text-md text-gray-300 italic mb-4 mt-4">
              {getPetCareTips(comfortLevel)}
            </p>
          )}

          <button
            onClick={refreshPrediction}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:scale-105 transition-all mt-4"
          >
            Refresh Prediction
          </button>
        </motion.div>

        {/* Pet Tips */}
        <motion.div
          className="bg-[#131b2e] p-6 rounded-2xl shadow-lg hover:shadow-pink-400/30 transition-all mt-5"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-2xl font-semibold mb-4">💡 Pet Care Tips</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Keep fresh water available 24/7.</li>
            <li>Adjust feeding amount if comfort score is low.</li>
            <li>Log symptoms like vomiting or lethargy.</li>
            <li>Maintain a consistent feeding schedule.</li>
            <li>Provide daily playtime and exercise.</li>
          </ul>
        </motion.div>
      </div>

      {/* New Features Section */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* 1. Health Anomaly Detection */}
        <motion.div
          className="bg-[#131b2e] p-6 rounded-2xl shadow-lg hover:shadow-pink-400/30 transition-all"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-2xl font-semibold mb-4">
            🩺 Health Anomaly Detection
          </h2>
          <p className="text-gray-400 mb-4">
            Enter your pet’s recent symptoms, diet, and activities to check
            health risks.
          </p>
          <textarea
            className="w-full mb-3 p-3 rounded-lg bg-[#0f1424] text-white"
            placeholder="Symptoms (e.g., vomiting, low energy)..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <input
            className="w-full mb-3 p-3 rounded-lg bg-[#0f1424] text-white"
            placeholder="Recent food intake (e.g., Chicken - 50g)"
            value={recentFood}
            onChange={(e) => setRecentFood(e.target.value)}
          />
          <input
            className="w-full mb-3 p-3 rounded-lg bg-[#0f1424] text-white"
            placeholder="Recent activity level (1-10)"
            type="number"
            value={recentActivity}
            onChange={(e) => setRecentActivity(e.target.value)}
          />
          <button
            onClick={checkHealthRisk}
            className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-lg hover:scale-105 transition-all"
          >
            Check Health Risk
          </button>
          {healthRisk && (
            <div className="mt-4 p-3 bg-[#0f1424] rounded-lg">
              <p className="text-lg font-semibold text-pink-400">
                RISK:{" "}
                {healthRisk && healthRisk.replace(/_/g, " ").toUpperCase()}
              </p>
              <p className="text-gray-300">{getPetHealthTips(healthRisk)}</p>
            </div>
          )}
        </motion.div>

        {/* 2. Diet Personalization */}
        <motion.div
          className="bg-[#131b2e] p-6 rounded-2xl shadow-lg hover:shadow-pink-400/30 transition-all"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-2xl font-semibold mb-4">
            🍽 Diet Personalization
          </h2>
          <p className="text-gray-400 mb-4">
            Get AI-recommended portion size and food type tailored to your pet.
          </p>
          <input
            className="w-full mb-3 p-3 rounded-lg bg-[#0f1424] text-white"
            placeholder="Breed (e.g., Labrador)"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />
          <input
            className="w-full mb-3 p-3 rounded-lg bg-[#0f1424] text-white"
            placeholder="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <input
            className="w-full mb-3 p-3 rounded-lg bg-[#0f1424] text-white"
            placeholder="Activity level (1-10)"
            type="number"
            value={dietActivity}
            onChange={(e) => setDietActivity(e.target.value)}
          />
          <button
            onClick={getDietRecommendation}
            className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-2 rounded-lg hover:scale-105 transition-all"
          >
            Get Diet Plan
          </button>
          {dietPlan && (
            <div className="mt-4 p-3 bg-[#0f1424] rounded-lg">
              <p className="text-lg font-semibold text-green-400">
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
    </motion.div>
  );
}
