import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Palette, Settings, Sparkles } from 'lucide-react';

function HomeMeta() {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {
      id: '1bhk',
      name: '1 BHK',
      icon: <Home className="w-12 h-12" />,
      color: 'from-cyan-400 to-blue-500',
      shadow: 'shadow-cyan-500/50',
      description: 'Cozy Studio Space',
      link: '/Metaverse/1bhk'
    },
    {
      id: '2bhk',
      name: '2 BHK',
      icon: <Home className="w-12 h-12" />,
      color: 'from-green-400 to-emerald-500',
      shadow: 'shadow-green-500/50',
      description: 'Family Comfort',
      link: '/Metaverse/2bhk'
    },
    {
      id: '3bhk',
      name: '3 BHK',
      icon: <Home className="w-12 h-12" />,
      color: 'from-orange-400 to-red-500',
      shadow: 'shadow-orange-500/50',
      description: 'Luxury Living',
      link: '/3bhk-home'
    },
    {
      id: 'customize',
      name: 'Customize',
      icon: <Settings className="w-12 h-12" />,
      color: 'from-purple-400 to-pink-500',
      shadow: 'shadow-purple-500/50',
      description: 'Design Your Own',
      link: '/customize-home'
    }
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden mt-18">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              METAVERSE HOME
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>
          <p className="text-xl text-white/70 font-light">
            Enter Your Virtual Reality • Design Your Digital Space
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Options Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {options.map((option) => (
              <Link
                key={option.id}
                to={option.link}
                className="block"
              >
                <div
                  className={`group relative cursor-pointer transform transition-all duration-500 hover:scale-110 ${
                    selectedOption?.id === option.id ? 'scale-110' : ''
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl ${option.shadow}`}></div>
                  
                  {/* Card */}
                  <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-64 flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 ${
                    selectedOption?.id === option.id ? 'bg-white/10 border-white/20' : ''
                  }`}>
                    {/* Icon Container */}
                    <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-r ${option.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <div className="text-white">
                        {option.icon}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                      {option.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/60 text-sm font-light group-hover:text-white/80 transition-colors">
                      {option.description}
                    </p>
                    
                    {/* Selection Indicator */}
                    {selectedOption?.id === option.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                    
                    {/* Hover Border Animation */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-cyan-400 group-hover:to-pink-400 transition-all duration-500"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Selection Feedback */}
        {selectedOption && (
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedOption.color}`}>
                <div className="text-white text-sm">
                  {selectedOption.icon}
                </div>
              </div>
              <div>
                <p className="text-white/70 text-sm">Selected Option</p>
                <p className="text-white font-semibold text-lg">{selectedOption.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-white/40 text-sm">
            Powered by Virtual Reality Technology
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeMeta;