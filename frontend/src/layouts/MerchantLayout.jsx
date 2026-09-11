import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MerchantLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 bg-white border-b font-semibold">Merchant Portal</header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
