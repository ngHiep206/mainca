import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Baby, 
  Search, 
  Map, 
  Heart, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Gift, 
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import { AuthProvider, useAuth } from './context/AuthContext';
import AIChatbot from './components/AIChatbot';

import GoogleLoginButton from './components/GoogleLoginButton';

// Pages - I will create these shortly
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ToyCatalog = React.lazy(() => import('./pages/ToyCatalog'));
const ToyDetail = React.lazy(() => import('./pages/ToyDetail'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Consultation = React.lazy(() => import('./pages/Consultation'));
const SafetyCenter = React.lazy(() => import('./pages/SafetyCenter'));

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Khám phá', path: '/toys', icon: Sparkles },
    { name: 'Cột mốc', path: '/dashboard', icon: Map },
    { name: 'Kiến thức', path: '/blog', icon: BookOpen },
    { name: 'An toàn', path: '/safety', icon: ShieldCheck },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:rotate-12 transition-transform">
              <Baby size={24} />
            </div>
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-brand-600 to-accent-strong bg-clip-text text-transparent">
              PlayWise
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-brand-600' : 'text-slate-500 hover:text-brand-600'
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-brand-100" />
                  <span className="text-sm font-bold text-slate-700 hidden lg:block">{user.displayName?.split(' ')[0]}</span>
                </button>
                <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors p-2" title="Đăng xuất">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <GoogleLoginButton text="Đăng nhập" className="py-2 px-6 h-11" />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-500">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600"
                >
                  <link.icon size={20} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
              {!user && (
                <div className="pt-4">
                  <GoogleLoginButton className="w-full" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center sm:text-left flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-4">
             <Baby className="text-brand-500" />
             <span className="text-xl font-display font-bold text-white tracking-tight">PlayWise</span>
          </div>
          <p className="text-sm leading-relaxed">
            Đồng hành cùng cha mẹ nuôi dưỡng tiềm năng của bé thông qua đồ chơi phát triển và kiến thức giáo dục sớm.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Tính năng</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/quiz" className="hover:text-brand-400">Trắc nghiệm</Link></li>
              <li><Link to="/toys" className="hover:text-brand-400">Bộ lọc thông minh</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-400">Nhật ký cột mốc</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Cộng đồng</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/consultation" className="hover:text-brand-400">Tư vấn 1:1</Link></li>
              <li><Link to="/blog" className="hover:text-brand-400">Blog giáo dục</Link></li>
              <li><Link to="/safety" className="hover:text-brand-400">Kiểm định an toàn</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-xs text-center">
        © {new Date().getFullYear()} PlayWise - Nền tảng tư vấn đồ chơi khoa học.
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AIChatbot />
        <div className="min-h-screen flex flex-col bg-slate-50/50">
          <Header />
          <main className="flex-grow pb-20 md:pb-0">
            <React.Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 text-brand-600"
                >
                  <Baby size={48} />
                </motion.div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/toys" element={<ToyCatalog />} />
                <Route path="/toy/:id" element={<ToyDetail />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/safety" element={<SafetyCenter />} />
              </Routes>
            </React.Suspense>
          </main>
          <Footer />
          <MobileBottomNav />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

function MobileBottomNav() {
  const location = useLocation();
  
  const links = [
    { name: 'Trang chủ', path: '/', icon: Baby },
    { name: 'Đồ chơi', path: '/toys', icon: Sparkles },
    { name: 'Cột mốc', path: '/dashboard', icon: BarChart3 },
    { name: 'Kiến thức', path: '/blog', icon: BookOpen },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-3 z-40 flex justify-between items-center safe-area-bottom">
      {links.map((link) => (
        <Link 
          key={link.path}
          to={link.path}
          className={`flex flex-col items-center gap-1 transition-colors ${
            location.pathname === link.path ? 'text-brand-600' : 'text-slate-400'
          }`}
        >
          <link.icon size={22} className={location.pathname === link.path ? 'scale-110' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{link.name}</span>
        </Link>
      ))}
    </div>
  );
}
