import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import { fetchAdmin } from "@/features/auth/redux/authThunks";
import { selectToken, selectUser } from "@/features/auth/redux/authSelector";
import { useConnectionMonitor } from "@/shared/services/connectionMonitor";

import Loader from "@/shared/components/ui/Loader";
import Footer from "@/shared/components/layout/footer/Footer";
import Navbar from "@/shared/components/layout/navbar/Navbar";
import Sidebar from "@/shared/components/layout/sidebar/Sidebar";

const AuthPage = lazy(() => import("@/features/auth/pages/AuthPage"));
const AdminDashboard = lazy(
  () => import("@/features/dashboard/pages/AdminDashboard"),
);
const AccountSettings = lazy(
  () => import("@/features/account/pages/AccountSettings"),
);
const AddDietPlan = lazy(() => import("@/features/dietplan/pages/AddDietPlan"));
const EditDietPlan = lazy(
  () => import("@/features/dietplan/pages/EditDietPlan"),
);
const DietPlanList = lazy(
  () => import("@/features/dietplan/pages/DietPlanList"),
);
const DietPlanDetails = lazy(
  () => import("@/features/dietplan/pages/DietPlanDetails"),
);
const AddWorkoutPlan = lazy(
  () => import("@/features/workoutplan/pages/AddWorkoutPlan"),
);
const EditWorkoutPlan = lazy(
  () => import("@/features/workoutplan/pages/EditWorkoutPlan"),
);
const WorkoutPlanList = lazy(
  () => import("@/features/workoutplan/pages/WorkoutPlanList"),
);
const WorkoutPlanDetails = lazy(
  () => import("@/features/workoutplan/pages/WorkoutPlanDetails"),
);
const AddTrainer = lazy(() => import("@/features/trainer/pages/AddTrainer"));
const EditTrainer = lazy(() => import("@/features/trainer/pages/EditTrainer"));
const TrainerList = lazy(() => import("@/features/trainer/pages/TrainerList"));
const TrainerDetails = lazy(
  () => import("@/features/trainer/pages/TrainerDetails"),
);
const TrainerPayroll = lazy(
  () => import("@/features/trainer/pages/TrainerPayroll"),
);

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  // Background server connection check
  useConnectionMonitor();

  useEffect(() => {
    if (token && !user) dispatch(fetchAdmin());
  }, [token, user, dispatch]);

  if (token && !user) {
    return <Loader />;
  }

  if (!token) {
    return (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/authentication" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/authentication" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/home" element={<AdminDashboard />} />
              <Route path="/account/settings" element={<AccountSettings />} />
              <Route path="*" element={<Navigate to="/home" replace />} />

              {/* Trainer */}
              <Route path="/trainer/list" element={<TrainerList />} />
              <Route path="/trainer/add" element={<AddTrainer />} />
              <Route path="/trainer/edit/:id" element={<EditTrainer />} />
              <Route path="/trainer/details/:id" element={<TrainerDetails />} />
              <Route path="/trainer/payroll" element={<TrainerPayroll />} />

              {/* DietPlan */}
              <Route path="/plan/diet/list" element={<DietPlanList />} />
              <Route path="/plan/diet/add" element={<AddDietPlan />} />
              <Route
                path="/plan/diet/edit/:dietPlanId"
                element={<EditDietPlan />}
              />
              <Route
                path="/plan/diet/details/:dietPlanId"
                element={<DietPlanDetails />}
              />

              {/* WorkoutPlan */}
              <Route path="/plan/workout/list" element={<WorkoutPlanList />} />
              <Route path="/plan/workout/add" element={<AddWorkoutPlan />} />
              <Route
                path="/plan/workout/edit/:workoutPlanId"
                element={<EditWorkoutPlan />}
              />
              <Route
                path="/plan/workout/details/:workoutPlanId"
                element={<WorkoutPlanDetails />}
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
};

export default App;
