import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
            left: '10%',
            top: '20%',
            width: '40%',
            height: '40%'
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-l from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `translate(-${mousePosition.x * 0.05}px, -${mousePosition.y * 0.05}px)`,
            right: '10%',
            bottom: '20%',
            width: '30%',
            height: '30%'
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
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo/Icon */}
        <div className="mb-8 relative top-28 right-80">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 animate-pulse">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-md"></div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl"></div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-300 mb-6 tracking-tight">
          MetaHome
        </h1>
        
        <div className="text-xl md:text-2xl font-light text-blue-100/80 mb-4 tracking-wide">
          2D Metaverse
        </div>

        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl leading-relaxed font-light">
          Step into the future of home automation. Control your smart devices in an immersive 
          <span className="text-blue-400 font-medium"> 2D metaverse environment</span> where technology meets imagination.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          <a 
            href="/login"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            onMouseEnter={() => setHoveredButton('login')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Link to='/Metaverse' className="relative flex items-center gap-3">
              Enter Metaverse
            </Link>
          </a>
          
          <a 
            href="/register"
            className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10"
            onMouseEnter={() => setHoveredButton('register')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <span className="relative">Create Account</span>
          </a>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl my-28 mt-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-white/80 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Smart Control</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Manage all your IoT devices through an intuitive 2D interface
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-white/80 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Immersive Experience</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Navigate your digital home in a beautiful metaverse environment
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-white/80 rounded-lg"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-time Sync</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Instant updates and seamless device synchronization
            </p>
          </div>
        </div>

        {/* Bottom Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;