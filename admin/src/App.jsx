import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import { Loader } from "./components/Loader";
import LoginPage from "./pages/Login/AuthForm";
import { fetchUser } from "./redux/auth/authThunks";
import {
  selectUser,
  selectToken,
  selectAuthLoading,
} from "./redux/auth/authSelectors";

// Temporary pages
const TrainerDashboard = () => (
  <div className="flex-1 flex items-center justify-center">
    <h1 className="text-2xl font-semibold">Trainer Dashboard</h1>
  </div>
);

const StaffDashboard = () => (
  <div className="flex-1 flex items-center justify-center">
    <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
  </div>
);

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  // Fetch user only when needed
  useEffect(() => {
    if (token && !user) dispatch(fetchUser());
  }, [token, user, dispatch]);

  // Memoized route decision
  const routes = useMemo(() => {
    // Loading handled outside
    if (!token) {
      return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      );
    }

    if (!user) return null;

    switch (user.role) {
      case "admin":
        return (
          <Routes>
            <Route path="/trainer" element={<TrainerDashboard />} />
            <Route path="*" element={<Navigate to="/trainer" replace />} />
          </Routes>
        );

      case "staff":
        return (
          <Routes>
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="*" element={<Navigate to="/staff" replace />} />
          </Routes>
        );

      default:
        return <Navigate to="/login" replace />;
    }
  }, [token, user]);

  /* ---------------- RENDER ---------------- */
  return <div className="h-full">{routes}</div>;
};

export default App;
