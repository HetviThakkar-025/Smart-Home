import React from "react";

export default function SmartAssistant() {
  const features = [
    {
      id: "morning-brief",
      title: "🌅 Smart Morning Brief",
      description: "Daily weather, cost forecast & quote to start your day.",
      link: "/assistant/morning-brief",
      tooltip: "Start your day smarter!",
      side: "right",
    },
    {
      id: "smart-kitchen",
      title: "🍳 AI Smart Kitchen",
      description: "AI recipes, nutrition tracking & meal planning.",
      link: "/assistant/smart-kitchen",
      tooltip: "Cook smarter, eat healthier!",
      side: "left",
    },
    {
      id: "notes-wall",
      title: "📝 Smart Note & Reminder Wall",
      description: "Save notes, auto-detect urgent tasks with AI.",
      link: "/assistant/notes",
      tooltip: "Never miss a task!",
      side: "right",
    },
    {
      id: "virtual-stylist",
      title: "🛋️ DecorSense - AI Home Interior Stylist",
      description: "Upload your room photo & let AI suggest stylish improvements.",
      link: "/assistant/decor-sense",
      tooltip: "Transform your space with AI!",
      side: "left",
    },
    {
      id: "pet-assistant",
      title: "🐶 Pet Care Assistant",
      description: "Track feeding & schedule comfort for your pet.",
      link: "/assistant/pet",
      tooltip: "Your pet’s best friend!",
      side: "right",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <h1 className="text-4xl mt-3 md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
        Your Smart Assistant
      </h1>
      <div className="max-w-3xl mx-auto flex flex-col space-y-4">
        {features.map((feature) => (
          <a
            key={feature.id}
            href={feature.link}
            className="relative group flex items-center justify-between px-6 py-4 rounded-xl bg-slate-800/80 border border-white/10 backdrop-blur-xl shadow hover:shadow-lg transition-all duration-300 overflow-visible"
          >
            <div className="z-10">
              <h2 className="text-lg font-semibold text-white mb-1">
                {feature.title}
              </h2>
              <p className="text-gray-300 text-xs">{feature.description}</p>
            </div>

            {/* bigger gradient tooltip */}
            <span
              className={`
                absolute top-1/2 transform -translate-y-1/2
                px-4 py-2 text-sm rounded-lg text-white whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg
                ${
                  feature.side === "right"
                    ? "left-full ml-3"
                    : "right-full mr-3"
                }
              `}
            >
              {feature.tooltip}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
