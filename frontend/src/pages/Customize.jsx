import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Home, Plus, Trash2, Upload, Save, Sparkles, Cpu } from "lucide-react";
import SuccessModal from "./SuccessModal";

const Customize = () => {
  const [formData, setFormData] = useState({
    username: "",
    houseType: "1BHK",
    appliances: [],
    customAppliances: [],
    tileDesign: "",
    tileColor: "#ffffff",
    wallColor: "#ffffff",
    floorMaterial: "",
    lightingType: "",
    designImages: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplianceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.appliances, value]
        : prev.appliances.filter((item) => item !== value);
      return { ...prev, appliances: updated };
    });
  };

  const handleCustomApplianceChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.customAppliances];
      if (!updated[index]) {
        updated[index] = { name: "", watt: "" };
      }
      updated[index][field] = value;
      return { ...prev, customAppliances: updated };
    });
  };

  const addCustomAppliance = () => {
    setFormData((prev) => ({
      ...prev,
      customAppliances: [...prev.customAppliances, { name: "", watt: "" }],
    }));
  };

  const removeCustomAppliance = (index) => {
    setFormData((prev) => ({
      ...prev,
      customAppliances: prev.customAppliances.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      designImages: [...prev.designImages, ...files],
    }));

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      designImages: prev.designImages.filter((_, i) => i !== index),
    }));

    URL.revokeObjectURL(previewImages[index].url);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "appliances") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === "customAppliances") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === "designImages") {
          formData[key].forEach((file, index) => {
            submitData.append(`designImages`, file);
          });
        } else {
          submitData.append(key, formData[key]);
        }
      });

      await axios.post("/api/customization", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowModal(true);

      setFormData({
        username: "",
        houseType: "1BHK",
        appliances: [],
        customAppliances: [],
        tileDesign: "",
        tileColor: "#ffffff",
        wallColor: "#ffffff",
        floorMaterial: "",
        lightingType: "",
        designImages: [],
      });
      setPreviewImages([]);
    } catch (err) {
      alert("Failed to save customization.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16 px-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30">
              🏠
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Customize Home
            </h1>
          </div>
          <p className="text-xl text-white/70 font-light">
            Design your perfect smart home experience
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
        >
          {/* Personal Information */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Personal Information
              </h3>
            </div>
            <label className="block text-gray-300 mb-2">User Name *</label>
            <input
              type="text"
              name="username"
              value={formData.userId}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your user name"
              required
            />
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg shadow-purple-500/20">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Property Details
              </h3>
            </div>
            <label className="block text-gray-300 mb-2">House Type *</label>
            <select
              name="houseType"
              value={formData.houseType}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="1BHK" className="bg-purple-500">
                1 BHK - One Bedroom Hall Kitchen
              </option>
              <option value="2BHK" className="bg-purple-500">
                2 BHK - Two Bedroom Hall Kitchen
              </option>
              <option value="3BHK" className="bg-purple-500">
                3 BHK - Three Bedroom Hall Kitchen
              </option>
            </select>
          </div>

          {/* Appliances */}
          <div className="mb-8">
            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between items-center mb-4">
                {/* Left side with icon + label */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg shadow-indigo-500/30">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <label className="text-xl font-semibold text-white">
                    Custom Appliances
                  </label>
                </div>

                {/* Right side with button */}
                <motion.button
                  type="button"
                  onClick={addCustomAppliance}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Appliance
                </motion.button>
              </div>
              {formData.customAppliances.map((appliance, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 items-end"
                >
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={appliance.name || ""}
                      onChange={(e) =>
                        handleCustomApplianceChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Gaming Console"
                      className="w-full p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">
                      Watt Value
                    </label>
                    <input
                      type="number"
                      value={appliance.watt || ""}
                      onChange={(e) =>
                        handleCustomApplianceChange(
                          index,
                          "watt",
                          e.target.value
                        )
                      }
                      placeholder="e.g., 150"
                      className="w-full p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => removeCustomAppliance(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-red-600/20 text-red-300 rounded-lg border border-red-500/30 hover:bg-red-600/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>

          {/* Design & Materials */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg shadow-lg shadow-pink-500/20">
                <div className="text-white">🎨</div>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Design & Materials
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2">Tile Design</label>
                <input
                  type="text"
                  name="tileDesign"
                  value={formData.tileDesign}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="e.g., Marble finish, Geometric pattern"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  Floor Material
                </label>
                <input
                  type="text"
                  name="floorMaterial"
                  value={formData.floorMaterial}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="e.g., Hardwood, Ceramic tiles"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2">Tile Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="tileColor"
                    value={formData.tileColor}
                    onChange={handleChange}
                    className="w-12 h-12 rounded-lg border border-white/10 cursor-pointer"
                  />
                  <span className="text-white text-sm">
                    {formData.tileColor}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Wall Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="wallColor"
                    value={formData.wallColor}
                    onChange={handleChange}
                    className="w-12 h-12 rounded-lg border border-white/10 cursor-pointer"
                  />
                  <span className="text-white text-sm">
                    {formData.wallColor}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Lighting Type</label>
              <input
                type="text"
                name="lightingType"
                value={formData.lightingType}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                placeholder="e.g., LED strips, Pendant lights"
              />
            </div>
          </div>

          {/* Design Images Upload */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Design Inspiration
              </h3>
            </div>

            <label className="block text-gray-300 mb-2">
              Upload Reference Images
            </label>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-cyan-400/50 transition-all group">
              <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-cyan-400 transition-colors" />
              <span className="text-gray-400 group-hover:text-white transition-colors">
                Click to upload images
              </span>
              <span className="text-gray-500 text-sm mt-1">
                PNG, JPG, WEBP up to 10MB
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {previewImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-white mb-3">Uploaded Images:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.url}
                        alt={`Design ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-white/10 group-hover:border-cyan-400/50 transition-all"
                      />
                      <motion.button
                        onClick={() => removeImage(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full border border-red-500/30 hover:bg-red-700 transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </motion.button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                        {preview.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className={`px-8 py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center gap-2 mx-auto ${
                loading
                  ? "bg-gray-600/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/30"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Customization
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
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

      <SuccessModal
        show={showModal}
        message="Your personalized smart home design has been received. We’ll provide your virtual home soon. For queries, contact us at support@metahome.com"
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Customize;
