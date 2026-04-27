import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

interface GoogleLoginButtonProps {
  className?: string;
  text?: string;
}

export default function GoogleLoginButton({ className = '', text = 'Đăng nhập với Google' }: GoogleLoginButtonProps) {
  const { login, loading } = useAuth();

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={login}
      disabled={loading}
      className={`flex items-center justify-center gap-3 bg-white text-slate-700 font-bold border border-slate-200 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-200 transition-all ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          className="w-5 h-5"
        />
      )}
      {loading ? 'Đang kết nối...' : text}
    </motion.button>
  );
}
