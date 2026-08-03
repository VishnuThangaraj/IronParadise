import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { type AppDispatch } from "@/app/store";
import {
  selectUser,
  selectAccessToken,
} from "@/modules/auth/redux/authSelector";
import { fetchUserProfile } from "@/modules/auth/redux/authThunks";

import Loader from "@/shared/components/ui/feedback/Loader";
import Footer from "@/shared/components/layout/footer/Footer";
import Navbar from "@/shared/components/layout/navbar/Navbar";
import Sidebar from "@/shared/components/layout/sidebar/Sidebar";

const AuthPage = lazy(() => import("@/modules/auth/pages/AuthPage"));
const Dashboard = lazy(() => import("@/modules/dashboard/pages/Dashboard"));

import { useConnectionMoniter } from "@/shared/service/connectionMoniter";

const App = () => {
  useConnectionMoniter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const token = useSelector(selectAccessToken);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [token, user, dispatch]);

  if (token && !user) return <Loader />;

  if (!token) {
    return (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/authenticate" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/authenticate" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-auto">
          <Navbar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
};

export default App;
