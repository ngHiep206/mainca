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
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      setIsMock(false);

      // Sync user profile to Firestore
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(userRef, {
          updatedAt: serverTimestamp(),
          photoURL: result.user.photoURL // Update photo in case it changed
        }, { merge: true });
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      
      if (err.code === 'auth/operation-not-supported-in-this-environment') {
        alert('Trình duyệt của bạn đang chặn cửa sổ bật lên. Vui lòng mở ứng dụng trong tab mới hoặc dùng trình duyệt khác.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        console.log('Login cancelled by user');
      } else if (err.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        console.error('Domain not authorized:', domain);
        alert(`LỖI: Tên miền chưa được cấp phép!

Nếu bạn vừa mới thêm tên miền vào Firebase Console:
1. Vui lòng ĐỢI 2-3 PHÚT để Firebase cập nhật.
2. Đảm bảo bạn KHÔNG dán "https://" vào Firebase (chỉ dán: ${domain}).
3. Thử tải lại trang (Refresh).

Nếu vẫn không được, hãy thử mở app trong tab mới.`);
      } else {
        alert('Đăng nhập không thành công. Vui lòng thử lại sau.');
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
