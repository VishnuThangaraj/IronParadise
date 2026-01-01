import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useMemo, Suspense, lazy } from "react";

import "./App.scss";

import Loader from "./components/Loader";
import Footer from "./components/Footer";
import LoginPage from "./pages/Login/AuthForm";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

import { fetchUser } from "./redux/auth/authThunks";
import { selectUser, selectToken } from "./redux/auth/authSelectors";

// Lazy-loaded pages
const AddTrainer = lazy(() => import("./pages/Trainer/AddTrainer"));
const TrainersList = lazy(() => import("./pages/Trainer/TrainersList"));
const AdminDashborard = lazy(() => import("./pages/Dashboard/AdminDashborard"));

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
          <>
            <Sidebar />
            <div id="main-content-holder">
              <Navbar />
              <div
                id="main-content-origin"
                className="flex flex-col justify-between pt-6 px-5 h-full overflow-y-auto"
              >
                <Suspense fallback={<Loader />}>
                  <Routes>
                    {/* General */}
                    <Route path="/home" element={<AdminDashborard />} />

                    {/* Trainer */}
                    <Route path="/trainer/add" element={<AddTrainer />} />
                    <Route path="/trainer/list" element={<TrainersList />} />

                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </Routes>
                </Suspense>

                <Footer />
              </div>
            </div>
          </>
        );

      // case "staff":
      //   return (
      //     <Routes>
      //       <Route path="/staff" element={<StaffDashboard />} />
      //       <Route path="*" element={<Navigate to="/staff" replace />} />
      //     </Routes>
      //   );

      default:
        return <Navigate to="/login" replace />;
    }
  }, [token, user]);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="h-screen flex" style={{ width: "100vw" }}>
      {routes}
    </div>
  );
};

export default App;
