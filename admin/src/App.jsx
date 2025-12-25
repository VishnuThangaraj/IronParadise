import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import LoginPage from "./pages/AuthForm";
import { fetchUser } from "./redux/auth/authSlice";
import {
  selectUser,
  selectToken,
  selectAuthLoading,
} from "./redux/auth/authSelectors";

// Temporary pages
const TrainerDashboard = () => <h1>Trajjiner Dashboard</h1>;
const StaffDashboard = () => <h1>Staff Dashboard</h1>;

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const loading = useSelector(selectAuthLoading);

  // 🔐 Fetch user if token exists
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [token, user, dispatch]);

  // ⏳ Prevent flicker / wrong redirect
  if (loading) {
    return <div>Loading...</div>;
  }

  // ❌ Not logged in
  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // ❌ Token exists but user failed to load
  if (!user) {
    return null; // waiting for fetchUser
  }

  // ✅ Logged in + role-based routing
  return (
    <Routes>
      {user.role === "admin" && (
        <>
          <Route path="/trainer" element={<TrainerDashboard />} />
          <Route path="*" element={<Navigate to="/trainer" replace />} />
        </>
      )}

      {user.role === "staff" && (
        <>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="*" element={<Navigate to="/staff" replace />} />
        </>
      )}
    </Routes>
  );
};

export default App;
