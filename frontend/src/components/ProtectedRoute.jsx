import React from 'react';
import { Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Pass-through during initial sprint setup
  return <Outlet />;
}
