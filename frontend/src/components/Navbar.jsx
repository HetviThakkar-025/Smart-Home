import { useState, useEffect } from 'react';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'dashboard', label: 'Dashboard', href: '/Dashboard' },
    { id: 'metaverse', label: 'Metaverse', href: '/Homemeta' },
    { id: 'analytics', label: 'Analytics', href: '/analytics' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-900/80 backdrop-blur-xl' 
        : 'bg-slate-900/80 backdrop-blur-xl border-b border-0'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              MetaHome
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeItem === item.id
                    ? 'text-white bg-white/10 backdrop-blur-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                {item.label}
                {activeItem === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10"></div>
                )}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              Login
            </a>
            <a
              href="/register"
              className="group relative px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-200"></div>
              <span className="relative">Get Started</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-200 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-200 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-4 space-y-2 bg-slate-900/90 backdrop-blur-xl rounded-2xl mt-2 border border-white/10">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`block px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeItem === item.id
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => {
                  setActiveItem(item.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
            <div className="px-6 py-3 space-y-2 border-t border-white/10 mt-4">
              <a
                href="/login"
                className="block px-4 py-2 text-center text-sm font-medium text-gray-300 hover:text-white bg-white/5 rounded-xl transition-colors duration-200"
              >
                Login
              </a>
              <a
                href="/register"
                className="block px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium transition-all duration-200"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;