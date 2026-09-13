import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — Production route guard with RBAC
 *
 * @param {Object}   props
 * @param {string[]} [props.allowedRoles] — e.g. ['merchant'] or ['investor']
 * @param {React.ReactNode} [props.children] — optional children; falls back to <Outlet />
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  // ── 1. Hydration in progress: show branded spinner ───────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/25 animate-pulse">
            CF
          </div>
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#F8FAFC] animate-ping" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Verifying Session
          </span>
          <div className="w-24 h-1 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 animate-[shimmer_1.5s_ease-in-out_infinite]"
              style={{ animation: 'shimmer 1.5s ease-in-out infinite alternate', transformOrigin: 'left' }}
            />
          </div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  // ── 2. Not authenticated: redirect to /login, preserving intended destination ─
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── 3. Role-based access control ─────────────────────────────────────────
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to the user's own home route
    const homeRoute = role === 'merchant' ? '/merchant/dashboard' : '/investor/marketplace';
    return <Navigate to={homeRoute} replace />;
  }

  // ── 4. All checks passed: render route content ───────────────────────────
  return children || <Outlet />;
}
