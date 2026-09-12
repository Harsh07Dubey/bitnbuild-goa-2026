import React from 'react';
import { Routes, Route, Navigate, useParams, useSearchParams } from 'react-router-dom';

// Public & Auth Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';

// Investor Flow
import InvestorLayout from './layouts/InvestorLayout';
import Marketplace from './pages/investor/Marketplace';
import InvestorDashboard from './pages/investor/InvestorDashboard';
import InvestorOnboarding from './pages/investor/InvestorOnboarding';

// Merchant Flow
import MerchantLayout from './layouts/MerchantLayout';
import MerchantOnboarding from './pages/merchant/MerchantOnboarding';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import CreateContract from './pages/merchant/CreateContract';
import ContractDetails from './pages/merchant/ContractDetails';
import MerchantQR from './pages/merchant/MerchantQR';
import InventoryCheckpoint from './pages/merchant/InventoryCheckpoint';

// Payment Flow
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailed from './pages/payment/PaymentFailed';
import PaymentCard from './components/PaymentCard';

// Global Widgets & Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import RoleSwitcher from './components/RoleSwitcher';

// Deep linking redirect helper: /investor/contract/:id or /investor/fund/:id -> /investor/marketplace?fund=:id
function InvestorContractRedirect() {
  const { id } = useParams();
  return <Navigate to={`/investor/marketplace?fund=${id || ''}`} replace />;
}

// Backward-compatible alias handler for legacy /playground deep-links
function PlaygroundPassThrough() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab')?.toLowerCase();
  const fund = searchParams.get('fund') || searchParams.get('contract');

  if (tab === 'portfolio' || tab === 'analytics') {
    return <Navigate to={`/investor/dashboard${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} replace />;
  }
  if (fund) {
    return <Navigate to={`/investor/marketplace?fund=${fund}`} replace />;
  }
  return <Navigate to="/investor/marketplace" replace />;
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTPVerification />} />

        {/* Backward Compatibility Pass-Through Aliases */}
        <Route path="/playground" element={<PlaygroundPassThrough />} />
        <Route path="/marketplace" element={<Navigate to="/investor/marketplace" replace />} />

        {/* Onboarding Routes */}
        <Route path="/merchant/onboarding" element={<MerchantOnboarding />} />
        <Route path="/investor/onboarding" element={<InvestorOnboarding />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/merchant" element={<MerchantLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MerchantDashboard />} />
            <Route path="contract/create" element={<CreateContract />} />
            <Route path="contract/:id" element={<ContractDetails />} />
            <Route path="qr" element={<MerchantQR />} />
            <Route path="inventory" element={<InventoryCheckpoint />} />
          </Route>
        </Route>

        {/* Semantic Investor Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/investor" element={<InvestorLayout />}>
            <Route index element={<Navigate to="marketplace" replace />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="dashboard" element={<InvestorDashboard />} />
            <Route path="onboarding" element={<InvestorOnboarding />} />
            <Route path="contract/:id" element={<InvestorContractRedirect />} />
            <Route path="fund/:id" element={<InvestorContractRedirect />} />
          </Route>
        </Route>

        {/* Customer Checkout / Payment Terminal States */}
        <Route path="/pay" element={<PaymentCard isStandalone={true} />} />
        <Route path="/pay/:contractId" element={<PaymentCard isStandalone={true} />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating Demo Persona Switcher (Global Hackathon Widget) */}
      <RoleSwitcher />
    </>
  );
}
