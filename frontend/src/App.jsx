import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Metaverse from "./pages/Metaverse";
import Meta1bhk from "./pages/Meta1bhk";
import Homemeta from "./pages/Homemeta";
import Dashboard from "./pages/Dashboard";
import Meta3bhk from "./pages/Meta3bhk";
import SmartAssistant from "./pages/SmartAssistant";
import NotesWall from "./pages/NotesWall";
import MorningBrief from "./pages/MorningBrief";
import PetCare from "./pages/PetCare";
import SmartKitchen from "./pages/SmartKitchen";
import DecorSense from "./pages/DecorSense";
import Customize from "./pages/Customize";

const DEVICE_LABELS = {
  light: "Tube Light",
  fan: "Fan",
  tv: "TV",
  oven: "Oven",
  fridge: "Fridge",
  mirror: "Mirror Light",
  chimney: "Chimney",
  washingmachine: "Washing Machine",
  table: "Table",
  carpet: "Carpet",
  bed: "Bed",
  sofa: "Sofa",
};

const ALERT_THRESHOLDS = {
  DAILY_COST: 200,
  POWER_CONSUMPTION: 3000,
};

const INITIAL_POWER_DATA = {
  power: 0,
  energy: 0,
  cost: 0,
  peak: 0,
  devices: [],
  timestamp: new Date().toISOString(),
};

function App() {
  const [powerData, setPowerData] = useState(INITIAL_POWER_DATA);
  const [backendError, setBackendError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch("/api/power/history?days=7");
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setHistoricalData(data.data);
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
        setHistoricalData(
          Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
            power: Math.floor(Math.random() * 2000) + 500,
            energy: (Math.random() * 10).toFixed(2),
            cost: (Math.random() * 100).toFixed(2),
            peak: 2500,
          }))
        );
      }
    };

    fetchHistoricalData();
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        if (event.data?.type === "POWER_UPDATE") {
          console.log("Received POWER_UPDATE:", event.data.payload);

          const validatedData = validatePowerData(event.data.payload);
          setPowerData((prev) => ({
            ...prev,
            ...validatedData,
            timestamp: new Date().toISOString(),
          }));

          sendToBackend(validatedData);
        }
      } catch (error) {
        console.error("Error handling message:", error);
      }
    };

    const validatePowerData = (data) => {
      return {
        power: Number(data.power) || 0,
        energy: Number(data.energy) || 0,
        cost: Number(data.cost) || 0,
        peak: Number(data.peak) || 0,
        devices: Array.isArray(data.devices) ? data.devices : [],
        date: data.date || new Date().toDateString(),
      };
    };

    const sendToBackend = async (data) => {
      // Helper to safely parse JSON without crashing
      const parseJSONSafe = async (response) => {
        try {
          const text = await response.text();
          return text ? JSON.parse(text) : {};
        } catch {
          return {};
        }
      };

      try {
        setIsSaving(true);
        setBackendError(null);

        const response = await fetch("/api/power", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
          }),
        });

        const jsonData = await parseJSONSafe(response);

        if (!response.ok) {
          throw new Error(jsonData.message || "Failed to save power data");
        }

        return jsonData;
      } catch (error) {
        console.error("Backend error:", error);
        setBackendError(error.message);
        throw error;
      } finally {
        setIsSaving(false);
      }
    };

    const saveDailySummary = async (data) => {
      try {
        await sendToBackend({
          ...data,
          isDailySummary: true,
        });
      } catch (error) {
        console.error("Error saving daily summary:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [powerData.date]);

  return (
    <div className="font-sans bg-white text-gray-900 min-h-screen">
      <Navbar />

      {/* Backend error notification */}
      {backendError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
          <p>Backend Error: {backendError}</p>
          <button
            onClick={() => setBackendError(null)}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Saving indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-50">
          Saving data...
        </div>
      )}

      <div className="w-full pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/Dashboard"
            element={
              <Dashboard
                powerData={powerData}
                deviceLabels={DEVICE_LABELS}
                historicalData={historicalData}
              />
            }
          />
          <Route
            path="/Metaverse/2bhk"
            element={
              <Metaverse
                deviceLabels={DEVICE_LABELS}
                alertThresholds={ALERT_THRESHOLDS}
              />
            }
          />
          <Route path="/Customization" element={<Customize/>}></Route>
          <Route path="/Homemeta" element={<Homemeta />} />
          <Route path="/Metaverse/1bhk" element={<Meta1bhk />} />
          <Route path="/Metaverse/3bhk" element={<Meta3bhk />} />
          <Route path="/assistant" element={<SmartAssistant />} />
          <Route path="/assistant/notes" element={<NotesWall />} />
          <Route path="/assistant/morning-brief" element={<MorningBrief />} />
          <Route path="/assistant/pet" element={<PetCare />} />
          <Route path="/assistant/smart-kitchen" element={<SmartKitchen />} />
          <Route path="/assistant/decor-sense" element={<DecorSense />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
