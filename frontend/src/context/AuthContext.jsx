import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { sendOtp, verifyOtp, registerMerchant, logoutUser } from '../services/authService';

// ─── Context Setup ────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

const SESSION_KEY = 'fairfuture_session';

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(data) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not persist session', e);
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // 'merchant' | 'investor' | null
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Restore session on mount
  useEffect(() => {
    const session = loadSession();
    if (session?.isAuthenticated && session?.user) {
      setUser(session.user);
      setIsAuthenticated(true);
      setRole(session.user.role || null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // ── Phase A: Send OTP ──────────────────────────────────────────────────────
  const sendOtpToPhone = useCallback(async (phone) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await sendOtp(phone);
      // Persist phone to session for Phase B
      saveSession({ pendingPhone: phone });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Phase B: Verify OTP ────────────────────────────────────────────────────
  const verifyUserOtp = useCallback(async (phone, code) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await verifyOtp(phone, code);
      // Partially authenticated — phone confirmed, awaiting profile
      const partialUser = { phone, role: null };
      setUser(partialUser);
      saveSession({ pendingPhone: phone, token: result.token, phoneVerified: true });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Phase C: Complete Merchant Profile ────────────────────────────────────
  const completeMerchantProfile = useCallback(async (profileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerMerchant({
        phone: user?.phone || profileData.phone,
        ...profileData,
      });

      const fullUser = {
        phone: result.profile.phone,
        stallName: result.profile.stallName,
        shopAddress: result.profile.shopAddress,
        category: result.profile.category,
        role: 'merchant',
        merchantId: result.merchantId,
        contractId: result.profile.contractId,
        verifiedAt: result.profile.verifiedAt,
      };

      setUser(fullUser);
      setIsAuthenticated(true);
      setRole('merchant');
      saveSession({ user: fullUser, isAuthenticated: true });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
      clearSession();
      setIsLoading(false);
    }
  }, []);

  // ── Dev/Hackathon: Quick bypass for demo navigation ───────────────────────
  const setDemoMerchant = useCallback(() => {
    const demoUser = {
      phone: '9876543210',
      stallName: 'Sharma General Store',
      shopAddress: 'Sector 4, Main Bazar Road, Jaipur',
      category: 'Retail (Food & Grocery)',
      role: 'merchant',
      merchantId: 'MCH-DEMO01',
      contractId: 'CON-001',
    };
    setUser(demoUser);
    setIsAuthenticated(true);
    setRole('merchant');
    saveSession({ user: demoUser, isAuthenticated: true });
  }, []);

  const value = {
    user,
    isAuthenticated,
    role,
    isLoading,
    error,
    clearError,
    sendOtp: sendOtpToPhone,
    verifyOtp: verifyUserOtp,
    completeMerchantProfile,
    logout,
    setDemoMerchant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

export default AuthContext;
