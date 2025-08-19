import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function SmartAssistant() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      id: "morning-brief",
      title: "🌅 Smart Morning Brief",
      description: "Daily weather, cost forecast & quote to start your day.",
      link: "/assistant/morning-brief",
      tooltip: "Start your day smarter!",
      color: "from-yellow-400 to-orange-400",
      icon: "☀️",
    },
    {
      id: "smart-kitchen",
      title: "🍳 AI Smart Kitchen",
      description: "AI recipes, nutrition tracking & meal planning.",
      link: "/assistant/smart-kitchen",
      tooltip: "Cook smarter, eat healthier!",
      color: "from-red-400 to-pink-500",
      icon: "👨‍🍳",
    },
    {
      id: "notes-wall",
      title: "📝 Smart Note & Reminder Wall",
      description: "Save notes, auto-detect urgent tasks with AI.",
      link: "/assistant/notes",
      tooltip: "Never miss a task!",
      color: "from-blue-400 to-indigo-500",
      icon: "📌",
    },
    {
      id: "virtual-stylist",
      title: "🛋️ DecorSense - AI Home Stylist",
      description:
        "Upload your room photo & let AI suggest stylish improvements.",
      link: "/assistant/decor-sense",
      tooltip: "Transform your space with AI!",
      color: "from-purple-400 to-pink-400",
      icon: "🎨",
    },
    {
      id: "pet-assistant",
      title: "🐶 Pet Care Assistant",
      description: "Track feeding & schedule comfort for your pet.",
      link: "/assistant/pet",
      tooltip: "Your pet's best friend!",
      color: "from-green-400 to-teal-500",
      icon: "🐕",
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
        {/* Header with AI-themed decoration */}
        <div className="text-center mb-16 max-w-4xl mx-auto relative">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative"></div>
            <h1 className="text-5xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              🌟 SMART ASSISTANT 🌟
            </h1>
            <div className="relative"></div>
          </div>
          <p className="text-xl text-white/70 font-light mb-6">
            Your AI-powered companion for smarter living
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Features List */}
        <div className="max-w-3xl mx-auto space-y-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="relative group"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <Link
                to={feature.link}
                className={`block relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border border-white/10 transition-all duration-500 ${
                  hoveredFeature === feature.id
                    ? "bg-white/10 border-white/20 shadow-xl"
                    : "bg-white/5"
                }`}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    feature.color
                  } opacity-0 rounded-2xl blur-xl transition-opacity duration-500 ${
                    hoveredFeature === feature.id ? "opacity-20" : ""
                  }`}
                ></div>

                <div className="relative z-10 flex items-center">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${
                      feature.color
                    } flex items-center justify-center text-2xl mr-6 transition-transform duration-300 ${
                      hoveredFeature === feature.id ? "scale-110" : ""
                    }`}
                  >
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-1">
                      {feature.title}
                    </h2>
                    <p className="text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    className={`w-6 h-6 ml-4 text-white/30 transition-all duration-300 ${
                      hoveredFeature === feature.id
                        ? "text-white translate-x-1"
                        : ""
                    }`}
                  />
                </div>

                {/* Connection line animation */}
                {hoveredFeature === feature.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-1000 group-hover:w-full"></div>
                )}
              </Link>

              {/* Tooltip */}
              {hoveredFeature === feature.id && (
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 px-4 py-2 text-sm rounded-lg text-white whitespace-nowrap bg-gradient-to-r ${
                    feature.color
                  } shadow-lg z-20 ${
                    index % 2 === 0 ? "left-full ml-4" : "right-full mr-4"
                  }`}
                >
                  {feature.tooltip}
                </div>
              )}
            </div>
          ))}
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
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
