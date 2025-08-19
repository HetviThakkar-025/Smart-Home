import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Palette, Settings, Sparkles, ArrowRight } from "lucide-react";

function HomeMeta() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);

  const options = [
    {
      id: "1bhk",
      name: "1 BHK",
      icon: <Home className="w-8 h-8" />,
      color: "from-cyan-400 to-blue-500",
      shadow: "shadow-cyan-500/30",
      description: "Cozy Studio Space",
      link: "/Metaverse/1bhk",
      features: ["Smart Lighting", "Compact Design", "AI Assistant"],
    },
    {
      id: "2bhk",
      name: "2 BHK",
      icon: <Home className="w-8 h-8" />,
      color: "from-green-400 to-emerald-500",
      shadow: "shadow-green-500/30",
      description: "Family Comfort",
      link: "/Metaverse/2bhk",
      features: ["Multi-room Control", "Family Profiles", "Entertainment Hub"],
    },
    {
      id: "3bhk",
      name: "3 BHK",
      icon: <Home className="w-8 h-8" />,
      color: "from-orange-400 to-red-500",
      shadow: "shadow-orange-500/30",
      description: "Luxury Living",
      link: "/Metaverse/3bhk",
      features: ["Premium Automation", "Smart Security", "VR Integration"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-24 pb-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
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
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            <h1 className="text-5xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              METAVERSE HOME
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>
          <p className="text-xl text-white/70 font-light mb-6">
            Enter Your Virtual Reality • Design Your Digital Space
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Options Grid */}
        {/* Options Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {options.map((option) => (
              <div
                key={option.id}
                className="group relative"
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <Link to={option.link} className="block h-full">
                  <div
                    className={`relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col transition-all duration-500 ${
                      selectedOption?.id === option.id
                        ? "scale-105 bg-white/10 border-white/20"
                        : "group-hover:scale-105 group-hover:bg-white/10 group-hover:border-white/20"
                    }`}
                  >
                    {/* Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        option.color
                      } opacity-0 rounded-3xl blur-xl transition-opacity duration-500 ${
                        hoveredOption === option.id ? "opacity-20" : ""
                      }`}
                    ></div>

                    {/* Icon Container */}
                    <div
                      className={`mb-6 p-4 rounded-2xl bg-gradient-to-r ${
                        option.color
                      } shadow-lg w-16 h-16 flex items-center justify-center mx-auto transition-transform duration-300 ${
                        hoveredOption === option.id ? "scale-110" : ""
                      }`}
                    >
                      <div className="text-white">{option.icon}</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-white mb-2 text-center">
                        {option.name}
                      </h3>
                      <p className="text-white/60 text-sm font-light text-center mb-4">
                        {option.description}
                      </p>

                      {/* Features List */}
                      <ul className="mt-auto space-y-2">
                        {option.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full mr-2"></div>
                            <span className="text-white/70 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-6 right-6 text-white/30 group-hover:text-white transition-colors duration-300">
                      <ArrowRight className="w-6 h-6" />
                    </div>

                    {/* Selection Indicator */}
                    {selectedOption?.id === option.id && (
                      <div className="absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Feedback */}
        {selectedOption && (
          <div className="text-center mt-16 animate-fade-in">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <div
                className={`p-3 rounded-lg bg-gradient-to-r ${selectedOption.color} shadow-md`}
              >
                {selectedOption.icon}
              </div>
              <div className="text-left">
                <p className="text-white/70 text-sm">Selected Home Type</p>
                <p className="text-white font-semibold text-lg">
                  {selectedOption.name} - {selectedOption.description}
                </p>
              </div>
              <Link
                to={selectedOption.link}
                className="ml-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
              >
                Continue
              </Link>
            </div>
          </div>
        )}
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
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default HomeMeta;
