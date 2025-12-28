import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import LoginPage from "./pages/AuthForm";
import { Loader } from "./components/Loader";
import { fetchUser } from "./redux/auth/authThunks";
import {
  selectUser,
  selectToken,
  selectAuthLoading,
} from "./redux/auth/authSelectors";

// Temporary pages
const TrainerDashboard = () => <h1>Trainer Dashboard</h1>;
const StaffDashboard = () => <h1>Staff Dashboard</h1>;

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [token, user, dispatch]);

  // Global loader
  if (loading) {
    return <Loader />;
  }

  // Not logged in
  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (!user) {
    return null;
  }

  // Role-based routing
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
