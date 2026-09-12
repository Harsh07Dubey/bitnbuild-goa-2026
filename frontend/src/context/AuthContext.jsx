import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendOtp, verifyOtp, registerMerchant, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  ROLE: 'creditflow_role',
  BALANCE: 'creditflow_liquid_balance',
  CONTRACT_ID: 'creditflow_contract_id',
  SESSION: 'fairfuture_session',
  USER: 'creditflow_user'
};

const DEFAULT_INVESTOR_USER = {
  name: 'A. Mehta',
  phone: '9876543210',
  role: 'investor',
  title: 'Accredited LP',
  initials: 'AM'
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
  initials: 'SG'
};

const DEFAULT_LIQUID_BALANCE = 355000;
const DEFAULT_CONTRACT_ID = 'CON-001';

export function AuthProvider({ children }) {
  let navigate = null;
  let location = null;
  try {
    navigate = useNavigate();
    location = useLocation();
  } catch {
    // Router context not ready yet
  }

  // Persistent Role (default: 'investor')
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ROLE) || 'investor';
    } catch {
      return 'investor';
    }
  });

  // Persistent Liquid Balance for simulated LP capital (default: 355,000)
  const [liquidBalance, setLiquidBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
      return saved !== null ? Number(saved) : DEFAULT_LIQUID_BALANCE;
    } catch {
      return DEFAULT_LIQUID_BALANCE;
    }
  });

  // Active Merchant Contract (default: 'CON-001')
  const [activeContractId, setActiveContractId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CONTRACT_ID) || DEFAULT_CONTRACT_ID;
    } catch {
      return DEFAULT_CONTRACT_ID;
    }
  });

  // Authentication Status (default true for frictionless hackathon demonstration)
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Authenticated Profile Details
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) return JSON.parse(savedUser);
      const initialRole = localStorage.getItem(STORAGE_KEYS.ROLE) || 'investor';
      return initialRole === 'merchant' ? DEFAULT_MERCHANT_USER : DEFAULT_INVESTOR_USER;
    } catch {
      return DEFAULT_INVESTOR_USER;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
      localStorage.setItem(STORAGE_KEYS.BALANCE, String(liquidBalance));
      localStorage.setItem(STORAGE_KEYS.CONTRACT_ID, activeContractId);
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
    } catch (e) {
      console.warn('[AuthContext] Could not persist state to localStorage', e);
    }
  }, [role, liquidBalance, activeContractId, user]);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Adjusts investor liquid funds upon simulated capital allocation or returns
   */
  const updateBalance = useCallback((amount, isAbsolute = false) => {
    setLiquidBalance((prev) => {
      const next = isAbsolute ? Number(amount) : prev + Number(amount);
      try {
        localStorage.setItem(STORAGE_KEYS.BALANCE, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  /**
   * Toggles active persona and programmatically updates current route
   * - Switching to 'merchant' -> /merchant/dashboard
   * - Switching to 'investor' -> /investor/marketplace
   */
  const switchRole = useCallback(
    (newRole) => {
      const targetRole = newRole === 'merchant' ? 'merchant' : 'investor';
      setRole(targetRole);

      // Update persona profile
      if (targetRole === 'merchant') {
        const merchantProfile = {
          ...DEFAULT_MERCHANT_USER,
          contractId: activeContractId
        };
        setUser(merchantProfile);
        try {
          localStorage.setItem(STORAGE_KEYS.ROLE, 'merchant');
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merchantProfile));
        } catch {}
      } else {
        setUser(DEFAULT_INVESTOR_USER);
        try {
          localStorage.setItem(STORAGE_KEYS.ROLE, 'investor');
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_INVESTOR_USER));
        } catch {}
      }

      const targetPath = targetRole === 'merchant' ? '/merchant/dashboard' : '/investor/marketplace';

      if (navigate) {
        navigate(targetPath);
      } else if (typeof window !== 'undefined') {
        window.location.href = targetPath;
      }
    },
    [activeContractId, navigate]
  );

  /**
   * Login action with phone and role
   */
  const login = useCallback((phone, selectedRole = 'investor') => {
    setIsAuthenticated(true);
    const targetRole = selectedRole === 'merchant' ? 'merchant' : 'investor';
    setRole(targetRole);

    const profile =
      targetRole === 'merchant'
        ? { ...DEFAULT_MERCHANT_USER, phone }
        : { ...DEFAULT_INVESTOR_USER, phone };

    setUser(profile);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, targetRole);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
      localStorage.setItem(
        STORAGE_KEYS.SESSION,
        JSON.stringify({ isAuthenticated: true, user: profile, role: targetRole })
      );
    } catch {}
  }, []);

  /**
   * Logout action
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      try {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem(STORAGE_KEYS.USER);
      } catch {}
      setIsLoading(false);
      if (navigate) {
        navigate('/login');
      }
    }
  }, [navigate]);

  // Backward compatible OTP methods for existing onboarding pages
  const sendOtpToPhone = useCallback(async (phone) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await sendOtp(phone);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyUserOtp = useCallback(async (phone, code) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await verifyOtp(phone, code);
      setIsAuthenticated(true);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeMerchantProfile = useCallback(async (profileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerMerchant({
        phone: user?.phone || profileData.phone,
        ...profileData
      });
      const fullUser = {
        name: profileData.stallName || 'Merchant Partner',
        phone: result.profile.phone,
        stallName: result.profile.stallName,
        shopAddress: result.profile.shopAddress,
        category: result.profile.category,
        role: 'merchant',
        merchantId: result.merchantId,
        contractId: result.profile.contractId || 'CON-001',
        initials: 'SG'
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
      setIsLoading(false);
    }
  }, [user]);

  const setDemoMerchant = useCallback(() => {
    setUser(DEFAULT_MERCHANT_USER);
    setRole('merchant');
    setIsAuthenticated(true);
    setActiveContractId('CON-001');
  }, []);

  const value = {
    role,
    user,
    liquidBalance,
    activeContractId,
    isAuthenticated,
    isLoading,
    error,
    switchRole,
    updateBalance,
    login,
    logout,
    clearError,
    sendOtp: sendOtpToPhone,
    verifyOtp: verifyUserOtp,
    completeMerchantProfile,
    setDemoMerchant,
    setActiveContractId
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
