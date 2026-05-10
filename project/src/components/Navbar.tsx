import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, FlaskConical, ScanLine, MessageSquare } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/prescription', label: 'Prescription', icon: FlaskConical },
  { path: '/scanner', label: 'Scanner', icon: ScanLine },
  { path: '/chat', label: 'AI Chat', icon: MessageSquare },
  { path: '/about', label: 'About' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
              <Activity className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Med<span className="text-cyan-400">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </nav>

          <Link
            to="/chat"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
          >
            <MessageSquare size={15} />
            Ask MedAI
          </Link>

          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-slate-900/98 backdrop-blur-md border-t border-white/5"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    {label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
