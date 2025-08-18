import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
    setEmail("");
  };

  const footerLinks = {
    product: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Metaverse", href: "/Homemeta" },
      { name: "Devices", href: "/devices" },
      { name: "Analytics", href: "/analytics" },
      { name: "Automation", href: "/automation" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press", href: "/press" },
      { name: "Partners", href: "/partners" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  };

  const socialLinks = [
    {
      name: "Twitter",
      icon: "𝕏",
      href: "#",
      color: "from-slate-400 to-slate-600 hover:shadow-slate-500/30",
    },
    {
      name: "Discord",
      icon: "💬",
      href: "#",
      color: "from-indigo-400 to-purple-600 hover:shadow-purple-500/30",
    },
    {
      name: "GitHub",
      icon: "⚡",
      href: "#",
      color: "from-gray-400 to-gray-600 hover:shadow-gray-500/30",
    },
    {
      name: "LinkedIn",
      icon: "💼",
      href: "#",
      color: "from-blue-400 to-blue-600 hover:shadow-blue-500/30",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-black border-t border-white/10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 group mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <div className="w-5 h-5 bg-white rounded-md group-hover:scale-110 transition-transform duration-300"></div>
                    </div>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                  MetaHome
                </div>
              </Link>

              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Experience the future of home automation in our immersive{" "}
                <span className="text-blue-300">2D metaverse</span>. Control
                your smart devices like never before.
              </p>

              {/* Newsletter Signup */}
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <span className="mr-2">Stay Updated</span>
                  {isSubscribed && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full animate-fade-in">
                      Subscribed!
                    </span>
                  )}
                </h3>
                <form onSubmit={handleNewsletterSubmit} className="flex group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300 group-hover:bg-white/15"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="group-hover:animate-pulse">✉️</span>
                      Subscribe
                    </span>
                  </button>
                </form>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`relative w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 hover:shadow-lg`}
                    onMouseEnter={() => setHoveredSocial(social.name)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    title={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                    {hoveredSocial === social.name && (
                      <span className="absolute -bottom-6 text-xs text-white bg-black/50 px-2 py-1 rounded-full whitespace-nowrap">
                        {social.name}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 col-span-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-6 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Product
                </h3>
                <ul className="space-y-4">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 transform inline-block group"
                      >
                        <span className="relative">
                          {link.name}
                          <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-6 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Company
                </h3>
                <ul className="space-y-4">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 transform inline-block group"
                      >
                        <span className="relative">
                          {link.name}
                          <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-6 flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                  Support
                </h3>
                <ul className="space-y-4">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 transform inline-block group"
                      >
                        <span className="relative">
                          {link.name}
                          <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} MetaHome. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-400 text-sm group">
              <span>Made with</span>
              <span className="text-red-400 animate-pulse">♥</span>
              <span>for the</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                Metaverse
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
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
            transform: translateY(5px);
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
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
