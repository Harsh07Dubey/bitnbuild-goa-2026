import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  sendOtp as apiSendOtp,
  verifyOtp as apiVerifyOtp,
  login as apiLogin,
  register as apiRegister,
  registerMerchant,
  registerInvestor,
  getCurrentUser,
  logoutUser,
} from '../services/authService';
import { warmupBackend } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  ROLE: 'creditflow_role',
  BALANCE: 'creditflow_liquid_balance',
  CONTRACT_ID: 'creditflow_contract_id',
  SESSION: 'fairfuture_session',
  LEGACY_USER: 'creditflow_user',
};

const DEFAULT_INVESTOR_USER = {
  name: 'Ananya Mehta',
  email: 'ananya.mehta@syndicate.capital',
  phone: '9876543210',
  role: 'investor',
  title: 'Accredited LP',
  investorType: 'Accredited LP / Angel',
  investorId: 'INV-DEMO01',
  payoutRef: 'lp-sandbox@okaxis',
  initials: 'AM',
};

const DEFAULT_MERCHANT_USER = {
  name: 'Ramesh Sharma',
  phone: '9876543210',
  stallName: 'Sharma General Store',
  shopAddress: 'Sector 4, Main Bazar Road, Jaipur',
  category: 'Retail (Food & Grocery)',
  role: 'merchant',
  merchantId: 'MCH-DEMO01',
  contractId: 'CON-001',
  initials: 'SG',
};

const DEFAULT_LIQUID_BALANCE = 355000;
const DEFAULT_CONTRACT_ID = 'CON-001';

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // 1. Persistent Token State
  const [token, setToken] = useState(() => {
    try {
      return (
        localStorage.getItem(STORAGE_KEYS.TOKEN) ||
        localStorage.getItem('fairfuture_token') ||
        null
      );
    } catch {
      return null;
    }
  });

  // 2. Persistent Role State (default: 'investor')
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ROLE) || 'investor';
    } catch {
      return 'investor';
    }
  });

  // 3. Persistent User State
  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem(STORAGE_KEYS.USER) ||
        localStorage.getItem(STORAGE_KEYS.LEGACY_USER);
      if (savedUser) return JSON.parse(savedUser);
      return null;
    } catch {
      return null;
    }
  });

  // 4. Authentication Status — real enforcement, no more || true fallback
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      return Boolean(savedToken);
    } catch {
      return false;
    }
  });

  // 5. Loading & Error States — starts true so ProtectedRoute shows spinner during hydration
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 6. Persistent Liquid Balance for simulated LP capital
  const [liquidBalance, setLiquidBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
      return saved !== null ? Number(saved) : DEFAULT_LIQUID_BALANCE;
    } catch {
      return DEFAULT_LIQUID_BALANCE;
    }
  });

  // 7. Active Merchant Contract
  const [activeContractId, setActiveContractId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CONTRACT_ID) || DEFAULT_CONTRACT_ID;
    } catch {
      return DEFAULT_CONTRACT_ID;
    }
  });

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
      localStorage.setItem(STORAGE_KEYS.BALANCE, String(liquidBalance));
      localStorage.setItem(STORAGE_KEYS.CONTRACT_ID, activeContractId);
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.LEGACY_USER, JSON.stringify(user));
      }
      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }
    } catch (e) {
      console.warn('[AuthContext] Could not persist state to localStorage:', e);
    }
  }, [role, liquidBalance, activeContractId, user, token]);

  // ─── LISTEN FOR 401 SESSION EXPIRED EVENT FROM AXIOS INTERCEPTOR ───────────
  useEffect(() => {
    const handleSessionExpired = () => {
      console.warn('[AuthContext] Session expired event received. Clearing state.');
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  // ─── INITIALIZATION ON MOUNT ───────────────────────────────────────────────
  const initializeAuth = useCallback(async () => {
    // 1. Trigger non-blocking backend wakeup ping for Render free-tier
    warmupBackend();

    // 2. If token exists, verify via GET /api/users/me
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const remoteUser = await getCurrentUser();
      if (remoteUser) {
        const resolvedRole = (remoteUser.role || role).toLowerCase();
        setUser((prev) => ({
          ...(prev || {}),
          ...remoteUser,
          role: resolvedRole,
        }));
        setRole(resolvedRole);
        setIsAuthenticated(true);
      }
    } catch (err) {
      // If verification fails with 401 → token is invalid/expired, wipe session
      if (err?.response?.status === 401) {
        console.warn('[AuthContext] Stored token expired. Wiping session.');
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
        try {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        } catch {}
      } else {
        // Network error / backend cold start — preserve local session gracefully
        console.info('[AuthContext] Stored session preserved in offline/demo mode.');
      }
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Adjusts investor liquid funds upon capital allocation or returns
   */
  const updateBalance = useCallback((amount, isAbsolute = false) => {
    setLiquidBalance((prev) => {
      const next = isAbsolute ? Number(amount) : prev + Number(amount);
      try {
        localStorage.setItem(STORAGE_KEYS.BALANCE, String(next));
      } catch {}
      return next;
    });
  }, []);

  /**
   * Toggles active persona and updates current route
   * - Switching to 'merchant' -> /merchant/dashboard
   * - Switching to 'investor' -> /investor/marketplace
   */
  const switchRoleDemo = useCallback(
    (newRole) => {
      const targetRole = newRole === 'merchant' ? 'merchant' : 'investor';
      setRole(targetRole);

      if (targetRole === 'merchant') {
        const merchantProfile = {
          ...DEFAULT_MERCHANT_USER,
          contractId: activeContractId,
        };
        setUser(merchantProfile);
      } else {
        setUser(DEFAULT_INVESTOR_USER);
      }

      const targetPath = targetRole === 'merchant' ? '/merchant/dashboard' : '/investor/marketplace';
      navigate(targetPath);
    },
    [activeContractId, navigate]
  );

  const switchRole = switchRoleDemo;

  /**
   * Register a new user account
   * POST /api/auth/register
   */
  const register = useCallback(
    async ({ name, phone, email, role: userRole }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiRegister({
          name,
          phone,
          email,
          role: userRole,
        });

        // Store pending user ID for OTP verification
        if (result?.user_id) {
          try {
            localStorage.setItem('pending_user_id', result.user_id);
          } catch {}
        }

        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Login with phone: initiates auth or sends OTP
   */
  const loginWithPhone = useCallback(
    async (phone, targetRole) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiSendOtp(phone, targetRole || role);
        return res;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  /**
   * Confirm OTP, save token and user, update context
   */
  const confirmOtp = useCallback(
    async (phone, otp) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiVerifyOtp({ phone, otp });
        const receivedToken = result.token || btoa(`fairfuture:${phone}:${Date.now()}`);

        setToken(receivedToken);
        setIsAuthenticated(true);

        const activeUser = result.user || {
          phone,
          role,
          name: role === 'merchant' ? 'Ramesh Sharma' : 'Ananya Mehta',
        };

        const resolvedRole = (activeUser.role || role).toLowerCase();
        setUser(activeUser);
        setRole(resolvedRole);

        try {
          localStorage.setItem(STORAGE_KEYS.TOKEN, receivedToken);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
          localStorage.setItem(STORAGE_KEYS.ROLE, resolvedRole);
        } catch {}

        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  /**
   * Logout user, clear state and navigate to /login
   */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
    } finally {
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      try {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem('pending_user_id');
      } catch {}
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  // Backward compatible login method
  const login = useCallback((phone, selectedRole = 'investor') => {
    setIsAuthenticated(true);
    const targetRole = selectedRole === 'merchant' ? 'merchant' : 'investor';
    setRole(targetRole);

    const profile =
      targetRole === 'merchant'
        ? { ...DEFAULT_MERCHANT_USER, phone }
        : { ...DEFAULT_INVESTOR_USER, phone };

    setUser(profile);
    const mockToken = btoa(`fairfuture:${phone}:${Date.now()}`);
    setToken(mockToken);

    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
      localStorage.setItem(STORAGE_KEYS.ROLE, targetRole);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
    } catch {}
  }, []);

  const completeMerchantProfile = useCallback(
    async (profileData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await registerMerchant({
          phone: user?.phone || profileData.phone,
          ...profileData,
        });
        const fullUser = {
          name: profileData.stallName || 'Merchant Partner',
          phone: result.profile?.phone || profileData.phone,
          stallName: result.profile?.stallName || profileData.stallName,
          shopAddress: result.profile?.shopAddress || profileData.shopAddress,
          category: result.profile?.category || profileData.category,
          role: 'merchant',
          merchantId: result.merchantId || 'MCH-DEMO01',
          contractId: result.profile?.contractId || 'CON-001',
          initials: 'SG',
        };
        setUser(fullUser);
        setRole('merchant');
        setIsAuthenticated(true);
        setActiveContractId(fullUser.contractId);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const completeInvestorProfile = useCallback(
    async (profileData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await registerInvestor({
          phone: user?.phone || profileData.phone,
          ...profileData,
        });
        const fullUser = {
          name: result.profile?.name || profileData.name,
          email: result.profile?.email || profileData.email,
          phone: result.profile?.phone || profileData.phone,
          role: 'investor',
          investorType: result.profile?.investorType || profileData.investorType,
          investorId: result.investorId || 'INV-DEMO01',
          payoutRef: result.profile?.payoutRef || profileData.payoutRef,
          allocationCommitment: result.profile?.allocationCommitment || profileData.allocationCommitment,
          title: result.profile?.investorType || 'Accredited LP',
          initials: 'AM',
        };
        setUser(fullUser);
        setRole('investor');
        setIsAuthenticated(true);
        if (result.profile?.allocationCommitment) {
          setLiquidBalance(result.profile.allocationCommitment);
        }
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const setDemoMerchant = useCallback(() => {
    setUser(DEFAULT_MERCHANT_USER);
    setRole('merchant');
    setIsAuthenticated(true);
    setActiveContractId('CON-001');
  }, []);

  const setDemoInvestor = useCallback(() => {
    setUser(DEFAULT_INVESTOR_USER);
    setRole('investor');
    setIsAuthenticated(true);
    setLiquidBalance(DEFAULT_LIQUID_BALANCE);
  }, []);

  const value = {
    // Standard prompt state properties
    user,
    token,
    isAuthenticated,
    role,
    loading,
    isLoading: loading, // alias

    // Standard prompt methods
    register,
    loginWithPhone,
    confirmOtp,
    logout,
    switchRoleDemo,
    initializeAuth,

    // Backward compatible methods & properties
    switchRole,
    sendOtp: loginWithPhone,
    verifyOtp: confirmOtp,
    completeMerchantProfile,
    completeInvestorProfile,
    setDemoMerchant,
    setDemoInvestor,
    login,
    updateBalance,
    liquidBalance,
    activeContractId,
    setActiveContractId,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

export default AuthContext;
