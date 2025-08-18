import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Features
  const smartHomeFeatures = [
    {
      title: "Smart Control",
      description:
        "Manage all your IoT devices through an intuitive 2D interface",
      color: "from-blue-500 to-cyan-500",
      icon: "🖥️",
    },
    {
      title: "Immersive Experience",
      description:
        "Navigate your digital home in a beautiful metaverse environment",
      color: "from-purple-500 to-pink-500",
      icon: "🌌",
    },
    {
      title: "Real-time Sync",
      description: "Instant updates and seamless device synchronization",
      color: "from-green-500 to-teal-500",
      icon: "⚡",
    },
  ];

  const smartAssistantFeatures = [
    {
      title: "🌅 Smart Morning Brief",
      description: "Daily weather, cost forecast & quote to start your day",
      color: "from-yellow-400 to-orange-400",
    },
    {
      title: "🍳 AI Smart Kitchen",
      description: "AI recipes, nutrition tracking & meal planning",
      color: "from-red-400 to-pink-500",
    },
    {
      title: "📝 Smart Note & Reminder Wall",
      description: "Save notes, auto-detect urgent tasks with AI",
      color: "from-blue-400 to-indigo-500",
    },
    {
      title: "🛋️ DecorSense - AI Home Stylist",
      description: "Upload your room photo & get stylish AI suggestions",
      color: "from-purple-400 to-pink-400",
    },
    {
      title: "🐶 Pet Care Assistant",
      description: "Track feeding & schedule comfort for your pet",
      color: "from-green-400 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400/10 animate-float"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${
              mousePosition.y * 0.1
            }px)`,
            left: "10%",
            top: "20%",
            width: "40%",
            height: "40%",
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-l from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `translate(-${mousePosition.x * 0.05}px, -${
              mousePosition.y * 0.05
            }px)`,
            right: "10%",
            bottom: "20%",
            width: "30%",
            height: "30%",
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Animated Logo */}
        <div className="mb-8 relative group">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 animate-pulse">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-45">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-600 font-bold text-xl transition-all duration-300 group-hover:scale-110">
                MH
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Title with animated gradient */}
        <div className="relative mb-6">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-300 tracking-tight">
            MetaHome
          </h1>
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
        </div>

        <div className="text-xl md:text-2xl font-light text-blue-100/80 mb-4 tracking-wide animate-bounce animate-infinite animate-duration-3000 animate-ease-in-out">
          2D Metaverse
        </div>

        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl leading-relaxed font-light text-center">
          Step into the future of home automation. Control your smart devices in
          an immersive{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-blue-400 font-medium">
              2D metaverse environment
            </span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500/30 animate-underline"></span>
          </span>{" "}
          where technology meets imagination.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <Link
            to="/Homemeta"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 overflow-hidden"
            onMouseEnter={() => setHoveredButton("login")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <span className="absolute -inset-10 bg-gradient-to-r from-white/30 to-white/0 group-hover:-inset-5 transition-all duration-500 rotate-45"></span>
            </span>
            <span className="relative flex items-center gap-3">
              <span className="group-hover:animate-pulse">🚀</span>
              Enter Metaverse
            </span>
          </Link>

          <Link
            to="/register"
            className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/20 overflow-hidden"
            onMouseEnter={() => setHoveredButton("register")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative flex items-center gap-3">
              <span className="group-hover:animate-bounce">✨</span>
              Create Account
            </span>
          </Link>
        </div>

        {/* Feature Cards Section */}
        <div className="w-full max-w-6xl my-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center relative">
            <span className="relative z-10 px-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full">
              Smart Home Features
            </span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
          </h2>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {smartHomeFeatures.map((feature, idx) => (
              <div
                key={idx}
                className={`w-80 h-64 p-6 rounded-3xl backdrop-blur-sm border border-white/10 bg-gradient-to-br from-white/5 to-white/10 text-white cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl group`}
              >
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r ${feature.color} text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12`}
                  >
                    {feature.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                  {feature.description}
                </p>
                <div className="absolute bottom-4 right-4 text-white/30 group-hover:text-white/60 transition-colors">
                  →
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white mb-8 text-center relative">
            <span className="relative z-10 px-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full">
              Smart Assistant Features
            </span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {smartAssistantFeatures.map((feature, idx) => (
              <div
                key={idx}
                className={`w-72 h-60 p-6 rounded-3xl backdrop-blur-sm border border-white/10 bg-gradient-to-br from-white/5 to-white/10 text-white cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl group`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r ${feature.color} text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  {feature.title.split(" ")[0]}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                  {feature.description}
                </p>
                <div className="absolute bottom-4 right-4 text-white/30 group-hover:text-white/60 transition-colors">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating CTA */}
        <div className="fixed bottom-8 right-8 z-50">
          <Link
            to="/Homemeta"
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 animate-bounce animate-infinite animate-duration-2000"
          >
            <span className="text-2xl">🏠</span>
          </Link>
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
        @keyframes underline {
          0% {
            width: 0;
            left: 0;
          }
          50% {
            width: 100%;
            left: 0;
          }
          100% {
            width: 0;
            left: 100%;
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-underline {
          animation: underline 2s ease-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;
