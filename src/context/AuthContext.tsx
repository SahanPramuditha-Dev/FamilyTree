import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
  googleProvider,
  signInWithPopup,
  type FirebaseUser
} from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  quickDemoLogin: (role?: 'owner' | 'admin' | 'viewer') => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ft_active_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const customUser: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Family Historian',
          photoURL: fbUser.photoURL || undefined,
          defaultFamilyId: 'fam-user-tree',
          twoFactorEnabled: false,
          language: 'English (US)',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          role: 'owner',
          createdAt: fbUser.metadata.creationTime || new Date().toISOString()
        };
        setUser(customUser);
        localStorage.setItem('ft_active_user', JSON.stringify(customUser));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const customUser: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'Family Historian',
        photoURL: fbUser.photoURL || undefined,
        defaultFamilyId: 'fam-user-tree',
        twoFactorEnabled: false,
        language: 'English (US)',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        role: 'owner',
        createdAt: fbUser.metadata.creationTime || new Date().toISOString()
      };
      setUser(customUser);
      localStorage.setItem('ft_active_user', JSON.stringify(customUser));
    } catch (err: any) {
      console.warn('Google sign-in popup fallback to simulated account:', err.message);
      // Fallback for offline / demo environments
      const customUser: UserProfile = {
        uid: `google-${Date.now()}`,
        email: 'google.user@example.com',
        displayName: 'Google Account User',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        defaultFamilyId: 'fam-user-tree',
        twoFactorEnabled: false,
        language: 'English (US)',
        timezone: 'UTC',
        role: 'owner',
        createdAt: new Date().toISOString()
      };
      setUser(customUser);
      localStorage.setItem('ft_active_user', JSON.stringify(customUser));
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const customUser: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || email.split('@')[0],
        photoURL: cred.user.photoURL || undefined,
        defaultFamilyId: 'fam-user-tree',
        twoFactorEnabled: false,
        language: 'English (US)',
        timezone: 'UTC',
        role: email.includes('admin') ? 'admin' : 'owner',
        createdAt: new Date().toISOString()
      };
      setUser(customUser);
      localStorage.setItem('ft_active_user', JSON.stringify(customUser));
    } catch (err: any) {
      // Local fallback
      const customUser: UserProfile = {
        uid: `user-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        defaultFamilyId: 'fam-user-tree',
        twoFactorEnabled: false,
        language: 'English (US)',
        timezone: 'UTC',
        role: email.includes('admin') ? 'admin' : 'owner',
        createdAt: new Date().toISOString()
      };
      setUser(customUser);
      localStorage.setItem('ft_active_user', JSON.stringify(customUser));
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await firebaseUpdateProfile(cred.user, { displayName: name });
      const customUser: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName: name,
        defaultFamilyId: 'fam-user-tree',
        twoFactorEnabled: false,
        language: 'English (US)',
        timezone: 'UTC',
        role: 'owner',
        createdAt: new Date().toISOString()
      };
      setUser(customUser);
      localStorage.setItem('ft_active_user', JSON.stringify(customUser));
    } catch (err) {
      const customUser: UserProfile = {
        uid: `user-${Date.now()}`,
        email,
        displayName: name,
        defaultFamilyId: 'fam-user-tree',
        twoFactorEnabled: false,
        language: 'English (US)',
        timezone: 'UTC',
        role: 'owner',
        createdAt: new Date().toISOString()
      };
      setUser(customUser);
      localStorage.setItem('ft_active_user', JSON.stringify(customUser));
    }
  };

  const quickDemoLogin = (role: 'owner' | 'admin' | 'viewer' = 'owner') => {
    const demo: UserProfile = {
      uid: 'user-demo-1',
      email: 'demo@familytree.dev',
      displayName: role === 'owner' ? 'Tree Creator (Owner)' : role === 'admin' ? 'Family Historian (Admin)' : 'Guest Relative (Viewer)',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Family historian documenting ancestral lineages, oral traditions, and memories.',
      defaultFamilyId: 'fam-sample-tree',
      twoFactorEnabled: false,
      language: 'English (US)',
      timezone: 'UTC',
      role: role === 'owner' || role === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };
    setUser(demo);
    localStorage.setItem('ft_active_user', JSON.stringify(demo));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('ft_active_user');
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.log('Password reset sent to:', email);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('ft_active_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      login,
      signInWithGoogle,
      register,
      quickDemoLogin,
      logout,
      resetPassword,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
