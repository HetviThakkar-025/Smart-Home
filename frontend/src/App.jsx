import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Fotter";
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

function App() {
  const [deviceStates, setDeviceStates] = useState({});

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "DEVICE_STATE_UPDATE") {
        setDeviceStates(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900">
      <Navbar />
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/Dashboard"
            element={<Dashboard deviceStates={deviceStates} />}
          />
          <Route path="/Metaverse/2bhk" element={<Metaverse />} />
          <Route path="/Homemeta" element={<Homemeta />} />
          <Route path="/Metaverse/1bhk" element={<Meta1bhk />} />
          <Route path="/Metaverse/3bhk" element={<Meta3bhk />}></Route>
          <Route path="/analytics" element={<AnalyticsPage />}></Route>
          <Route path="/assistant" element={<SmartAssistant />} />
          <Route path="/assistant/notes" element={<NotesWall />} />
          <Route path="/assistant/morning-brief" element={<MorningBrief />} />
          <Route path="/assistant/pet" element={<PetCare />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
