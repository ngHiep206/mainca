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
    try {
      const provider = new GoogleAuthProvider();
      // Ensure we are using popups as per best practices in this environment
      const result = await signInWithPopup(auth, provider);
      setIsMock(false);

      // Sync user to Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName,
          role: 'user',
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error('Firebase Auth failed, entering Mock Mode:', err);
      // Enter Mock Mode for preview if Real Auth fails (e.g. invalid API key or local dev)
      const mockUser = {
        uid: 'mock-user-123',
        displayName: 'Phụ huynh (Demo Mode)',
        email: 'parent@example.com',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mock-parent',
        emailVerified: true,
      } as User;
      
      setUser(mockUser);
      setIsMock(true);
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
