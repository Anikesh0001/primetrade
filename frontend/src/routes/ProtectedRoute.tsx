import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { tokenStorage } from "../services/tokenStorage";
import { authService } from "../services/auth";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const boot = async () => {
      const token = tokenStorage.getAccessToken();
      if (token) {
        setAuthorized(true);
        setReady(true);
        return;
      }

      if (tokenStorage.getRefreshToken()) {
        try {
          await authService.refresh();
          setAuthorized(true);
        } catch {
          setAuthorized(false);
        } finally {
          setReady(true);
        }
        return;
      }

      setAuthorized(false);
      setReady(true);
    };

    boot();
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Loading...</div>;
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
