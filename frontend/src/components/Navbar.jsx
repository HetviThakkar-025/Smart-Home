import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "metaverse", label: "Metaverse", href: "/Homemeta" },
    // { id: "analytics", label: "Analytics", href: "/analytics" },
    { id: "assistant", label: "Smart Assistant", href: "/assistant" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-900/90 backdrop-blur-xl border-b border-white/10"
          : "bg-slate-900/80 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:rotate-12">
                  <div className="w-5 h-5 bg-white rounded-sm group-hover:scale-110 transition-transform duration-300"></div>
                </div>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
              MetaHome
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`relative px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeItem === item.id
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setActiveItem(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className="relative z-10">{item.label}</span>
                {(activeItem === item.id || hoveredItem === item.id) && (
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${
                      activeItem === item.id
                        ? "from-blue-500/30 to-purple-500/30"
                        : "from-blue-500/10 to-purple-500/10"
                    } border border-white/10 backdrop-blur-sm`}
                  />
                )}
                {activeItem === item.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              <span className="relative z-10">Login</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/register"
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                <span className="group-hover:animate-pulse">✨</span>
                Get Started
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center relative">
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white mt-1.5 transition-all duration-200 ${
                  isMobileMenuOpen ? "opacity-0 -translate-x-4" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white mt-1.5 transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl mt-2 border border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`block px-6 py-4 text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  activeItem === item.id
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => {
                  setActiveItem(item.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="relative z-10">{item.label}</span>
                {activeItem === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"></div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30"></div>
              </Link>
            ))}
            <div className="px-6 py-4 space-y-3 border-t border-white/10 mt-2">
              <Link
                to="/login"
                className="block px-6 py-3 text-center text-sm font-medium text-gray-300 hover:text-white bg-white/5 rounded-xl transition-all duration-300 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="group block px-6 py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="group-hover:animate-bounce">🚀</span>
                  Get Started
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
