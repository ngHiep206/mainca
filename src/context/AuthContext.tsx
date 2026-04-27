import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isMock: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) setIsMock(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to ensure they can pick their personal account
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      setIsMock(false);

      // Sync user to Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Update last login
        await setDoc(doc(db, 'users', result.user.uid), {
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      
      // Handle known Firebase errors
      if (err.code === 'auth/operation-not-supported-in-this-environment') {
        alert('Trình duyệt của bạn không hỗ trợ cửa sổ bật lên (popup) hoặc đang bị chặn. Vui lòng mở ứng dụng trong tab mới hoặc dùng trình duyệt khác.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        // Silent closure
        console.log('User closed the login popup');
      } else if (err.code === 'auth/unauthorized-domain') {
        alert('Tên miền này chưa được cấp phép trong Firebase Console. Vui lòng kiểm tra cấu hình "Authorized domains".');
      } else {
        alert(`Lỗi đăng nhập: ${err.message || 'Đã có lỗi xảy ra'}`);
      }
      
      // We no longer fall back to mock mode here to ensure "REAL" accounts are used
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!isMock) {
      await signOut(auth);
    }
    setUser(null);
    setIsMock(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isMock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
