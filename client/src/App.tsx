import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { type AppDispatch } from "@/app/store";
import {
  selectUser,
  selectAccessToken,
} from "@/modules/auth/redux/auth.selector";
import { fetchUserProfile } from "@/modules/auth/redux/auth.thunks";

import Loader from "@/shared/components/ui/feedback/Loader";
import Footer from "@/shared/components/layout/footer/Footer";
import Navbar from "@/shared/components/layout/navbar/Navbar";
import Sidebar from "@/shared/components/layout/sidebar/Sidebar";

const AuthPage = lazy(() => import("@/modules/auth/pages/AuthPage"));
const Dashboard = lazy(() => import("@/modules/dashboard/pages/Dashboard"));

// Diet Plan
const DietPlanList = lazy(
  () => import("@/modules/diet-plan/pages/DietPlanList"),
);

// Membership Plan
const MembershipPlanList = lazy(
  () => import("@/modules/membership-plan/pages/MembershipPlanList"),
);
const MembershipPlanForm = lazy(
  () => import("@/modules/membership-plan/pages/MembershipPlanForm"),
);
const MembershipPlanDetails = lazy(
  () => import("@/modules/membership-plan/pages/MembershipPlanDetails"),
);

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
      <div className="flex h-screen overflow-hidden bg-slate-200/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <Sidebar />
        <div className="flex flex-col flex-1 h-screen overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
            <main className="flex-1 p-6 px-10">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Diet Plan */}
                <Route path="/plan/diet" element={<DietPlanList />} />

                {/* Membership Plan */}
                <Route path="/membership" element={<MembershipPlanList />} />
                <Route
                  path="/membership/add"
                  element={<MembershipPlanForm />}
                />
                <Route
                  path="/membership/edit/:planId"
                  element={<MembershipPlanForm />}
                />
                <Route
                  path="/membership/:planId"
                  element={<MembershipPlanDetails />}
                />

                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default App;
