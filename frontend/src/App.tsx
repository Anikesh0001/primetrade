import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import GlobalLoadingBar from "./components/GlobalLoadingBar";
import { authEvents } from "./services/authEvents";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    return authEvents.subscribe(() => {
      navigate("/login");
    });
  }, [navigate]);

  return (
    <>
      <GlobalLoadingBar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
