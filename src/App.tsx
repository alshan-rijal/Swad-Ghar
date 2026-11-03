import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireRole } from './auth';
import Login from './pages/Login';
import Waiter from './pages/Waiter';
import Chef from './pages/Chef';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/waiter"
            element={
              <RequireRole role="waiter">
                <Waiter />
              </RequireRole>
            }
          />
          <Route
            path="/chef"
            element={
              <RequireRole role="chef">
                <Chef />
              </RequireRole>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireRole role="admin">
                <Admin />
              </RequireRole>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
