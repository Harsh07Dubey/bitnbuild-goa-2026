import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

// Public & Auth Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import Playground from './pages/Playground';

// Merchant Flow
import MerchantLayout from './layouts/MerchantLayout';
import MerchantOnboarding from './pages/merchant/MerchantOnboarding';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import CreateContract from './pages/merchant/CreateContract';
import ContractDetails from './pages/merchant/ContractDetails';
import MerchantQR from './pages/merchant/MerchantQR';
import InventoryCheckpoint from './pages/merchant/InventoryCheckpoint';

// Investor Flow
import InvestorLayout from './layouts/InvestorLayout';
import InvestorOnboarding from './pages/investor/InvestorOnboarding';

// Payment Flow
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailed from './pages/payment/PaymentFailed';
import PaymentCard from './components/PaymentCard';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';

// Helper component for deep-linking fund/contract routes into Playground
function InvestorContractRedirect() {
  const { id } = useParams();
  return <Navigate to={`/playground?fund=${id || ''}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/marketplace" element={<Navigate to="/playground" replace />} />

        {/* Merchant Routes */}
        {/* Onboarding is publicly accessible post-OTP, before auth is fully set */}
        <Route path="/merchant/onboarding" element={<MerchantOnboarding />} />

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

        {/* Investor Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/investor" element={<InvestorLayout />}>
            <Route path="onboarding" element={<InvestorOnboarding />} />
            <Route path="marketplace" element={<Navigate to="/playground" replace />} />
            <Route path="contract/:id" element={<InvestorContractRedirect />} />
            <Route path="fund/:id" element={<InvestorContractRedirect />} />
            <Route path="dashboard" element={<Navigate to="/playground?tab=portfolio" replace />} />
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
    </BrowserRouter>
  );
}
