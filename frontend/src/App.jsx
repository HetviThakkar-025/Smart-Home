import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Metaverse from "./pages/Metaverse";
import Meta1bhk from "./pages/Meta1bhk";
import Homemeta from "./pages/Homemeta";
import Dashboard from "./pages/Dashboard";
import Meta3bhk from "./pages/Meta3bhk";
import AnalyticsPage from "./pages/AnalyticsPage";
import SmartAssistant from "./pages/SmartAssistant";
import NotesWall from "./pages/NotesWall";
import MorningBrief from "./pages/MorningBrief";
import PetCare from "./pages/PetCare";
import SmartKitchen from "./pages/SmartKitchen";
import DecorSense from "./pages/DecorSense";

// Default device labels configuration
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

// Initial power data state
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
      };
    };

    const sendToBackend = async (data) => {
      try {
        setIsSaving(true);
        setBackendError(null);

        const response = await fetch("/api/power", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save power data");
        }

        const result = await response.json();
        console.log("Data saved successfully:", result);
      } catch (error) {
        console.error("Backend error:", error);
        setBackendError(error.message);
      } finally {
        setIsSaving(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900">
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

      <div className="w-full">
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
                backendError={backendError}
              />
            }
          />
          <Route path="/Metaverse/2bhk" element={<Metaverse />} />
          <Route path="/Homemeta" element={<Homemeta />} />
          <Route path="/Metaverse/1bhk" element={<Meta1bhk />} />
          <Route path="/Metaverse/3bhk" element={<Meta3bhk />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/assistant" element={<SmartAssistant />} />
          <Route path="/assistant/notes" element={<NotesWall />} />
          <Route path="/assistant/morning-brief" element={<MorningBrief />} />
          <Route path="/assistant/pet" element={<PetCare />} />
          <Route path="/assistant/smart-kitchen" element={<SmartKitchen />} />
          <Route path="/assistant/decor-sense" element={<DecorSense />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
