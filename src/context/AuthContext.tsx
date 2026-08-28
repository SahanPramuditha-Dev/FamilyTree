import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { isDevMode } from '../utils/env';

// Session Storage Keys
const SESSION_STORAGE_KEY = 'ft_active_user';
const SESSION_LAST_ACTIVE_KEY = 'ft_session_last_active';
const SESSION_CREATED_AT_KEY = 'ft_session_created_at';
const SESSION_REMEMBER_ME_KEY = 'ft_remember_me';

// Session Expiration Timeouts
export const SESSION_INACTIVITY_REMEMBER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days inactivity
export const SESSION_INACTIVITY_SHORT_MS = 1 * 24 * 60 * 60 * 1000;    // 1 day (when Remember Me is disabled)
export const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;            // 14 days absolute max session age

export function checkSessionExpired(): boolean {
  const userSaved = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!userSaved) return false;

  const lastActiveStr = localStorage.getItem(SESSION_LAST_ACTIVE_KEY);
  const createdAtStr = localStorage.getItem(SESSION_CREATED_AT_KEY);
  const rememberMe = localStorage.getItem(SESSION_REMEMBER_ME_KEY) !== 'false';

  // If there's an active user stored without timestamps (legacy session), consider it expired
  if (!lastActiveStr) {
    return true;
  }

  const lastActive = parseInt(lastActiveStr, 10);
  const createdAt = createdAtStr ? parseInt(createdAtStr, 10) : lastActive;
  const now = Date.now();

  const timeoutLimit = rememberMe ? SESSION_INACTIVITY_REMEMBER_MS : SESSION_INACTIVITY_SHORT_MS;

  // Inactivity timeout
  if (isNaN(lastActive) || now - lastActive > timeoutLimit) {
    return true;
  }

  // Absolute maximum session age
  if (now - createdAt > SESSION_MAX_AGE_MS) {
    return true;
  }

  return false;
}

export function recordSessionActivity() {
  localStorage.setItem(SESSION_LAST_ACTIVE_KEY, String(Date.now()));
}

export function initSession(rememberMe: boolean = true) {
  const now = String(Date.now());
  localStorage.setItem(SESSION_LAST_ACTIVE_KEY, now);
  localStorage.setItem(SESSION_CREATED_AT_KEY, now);
  localStorage.setItem(SESSION_REMEMBER_ME_KEY, String(rememberMe));
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(SESSION_LAST_ACTIVE_KEY);
  localStorage.removeItem(SESSION_CREATED_AT_KEY);
  localStorage.removeItem(SESSION_REMEMBER_ME_KEY);
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isDemoUser: boolean;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  signInWithGoogle: (rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  quickDemoLogin: (role?: 'owner' | 'admin' | 'viewer', rememberMe?: boolean) => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildUserProfile(fbUser: FirebaseUser, role: UserProfile['role'] = 'owner'): UserProfile {
  return {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Family Historian',
    photoURL: fbUser.photoURL || undefined,
    defaultFamilyId: `fam-${fbUser.uid}`,
    twoFactorEnabled: false,
    language: 'English (US)',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    role,
    createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
  };
}

function createDemoUser(role: 'owner' | 'admin' | 'viewer'): UserProfile {
  return {
    uid: `demo-${role}`,
    email: 'demo@familytree.dev',
    displayName:
      role === 'owner'
        ? 'Tree Creator (Owner)'
        : role === 'admin'
          ? 'Family Historian (Admin)'
          : 'Guest Relative (Viewer)',
    photoURL:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Family historian documenting ancestral lineages, oral traditions, and memories.',
    defaultFamilyId: 'fam-sample-tree',
    twoFactorEnabled: false,
    language: 'English (US)',
    timezone: 'UTC',
    role: role === 'viewer' ? 'user' : 'admin',
    createdAt: new Date().toISOString(),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (checkSessionExpired()) {
      clearSession();
      return null;
    }
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved) as UserProfile;
    } catch {
      clearSession();
      return null;
    }
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(() => user?.uid.startsWith('demo-') ?? false);

  const logout = useCallback(async () => {
    if (firebaseUser || auth.currentUser) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Firebase sign out error:', err);
      }
    }
    setUser(null);
    setIsDemoUser(false);
    clearSession();
  }, [firebaseUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        if (checkSessionExpired()) {
          logout();
        } else {
          const customUser = buildUserProfile(fbUser);
          setUser(customUser);
          setIsDemoUser(false);
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(customUser));
          recordSessionActivity();
        }
      } else if (!isDemoUser) {
        setUser(null);
        clearSession();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoUser, logout]);

  // Track user activity and check for session expiration
  useEffect(() => {
    if (!user) return;

    let lastRecorded = Date.now();
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastRecorded > 30000) {
        lastRecorded = now;
        recordSessionActivity();
      }
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

    // Periodic check every 60 seconds
    const interval = setInterval(() => {
      if (checkSessionExpired()) {
        logout();
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    }, 60000);

    // Tab focus / visibility change check (when user comes back to the tab after days)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (checkSessionExpired()) {
          logout();
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login?expired=true';
          }
        } else {
          recordSessionActivity();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, logout]);

  const signInWithGoogle = async (rememberMe: boolean = true) => {
    const result = await signInWithPopup(auth, googleProvider);
    const customUser = buildUserProfile(result.user);
    initSession(rememberMe);
    setUser(customUser);
    setIsDemoUser(false);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(customUser));
  };

  const login = async (email: string, pass: string, rememberMe: boolean = true) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const customUser = buildUserProfile(
      cred.user,
      email.includes('admin') ? 'admin' : 'owner'
    );
    initSession(rememberMe);
    setUser(customUser);
    setIsDemoUser(false);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(customUser));
  };

  const register = async (name: string, email: string, pass: string, rememberMe: boolean = true) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await firebaseUpdateProfile(cred.user, { displayName: name });
    const customUser = buildUserProfile(cred.user, 'owner');
    customUser.displayName = name;
    initSession(rememberMe);
    setUser(customUser);
    setIsDemoUser(false);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(customUser));
  };

  const quickDemoLogin = (role: 'owner' | 'admin' | 'viewer' = 'owner', rememberMe: boolean = true) => {
    if (!isDevMode) {
      throw new Error('Demo login is only available in development mode.');
    }
    const demo = createDemoUser(role);
    initSession(rememberMe);
    setUser(demo);
    setIsDemoUser(true);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demo));
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    recordSessionActivity();
    if (firebaseUser && (data.displayName || data.photoURL)) {
      await firebaseUpdateProfile(firebaseUser, {
        displayName: data.displayName ?? firebaseUser.displayName,
        photoURL: data.photoURL ?? firebaseUser.photoURL,
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      isDemoUser,
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
