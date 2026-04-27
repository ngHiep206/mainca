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
      // Only use mock mode if specifically in a development environment without keys
      if (err.code === 'auth/operation-not-supported-in-this-environment' || err.code === 'auth/invalid-api-key') {
        console.warn('Entering Mock Mode due to environment constraints');
        const mockUser = {
          uid: 'mock-user-123',
          displayName: 'Phụ huynh (Demo Mode)',
          email: 'parent@example.com',
          photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mock-parent',
          emailVerified: true,
        } as User;
        setUser(mockUser);
        setIsMock(true);
      } else {
        // Re-throw or handle user cancellation
        if (err.code !== 'auth/popup-closed-by-user') {
          alert('Đăng nhập thất bại. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
        }
      }
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
