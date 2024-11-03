import { Toaster } from "sonner";
import { Loader } from "./components/Loader";
import { Footer } from "./components/Footer";
import { Suspense, lazy, useContext } from "react";
import { Navbar } from "./components/Navbar/Navbar";
import { AuthContext } from "./context/AuthContext";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./App.scss";

// Lazy-loaded pages
const AuthForm = lazy(() => import("./pages/AuthForm"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Events = lazy(() => import("./pages/Event/Events"));
const Attendance = lazy(() => import("./pages/Attendance"));
const AddEvent = lazy(() => import("./pages/Event/AddEvent"));
const AddMember = lazy(() => import("./pages/Member/AddMember"));
const EditMember = lazy(() => import("./pages/Member/EditMember"));
const AddTrainer = lazy(() => import("./pages/Trainer/AddTrainer"));
const MembersList = lazy(() => import("./pages/Member/MembersList"));
const EditTrainer = lazy(() => import("./pages/Trainer/EditTrainer"));
const AddDietplan = lazy(() => import("./pages/Dietplan/AddDietplan"));
const TrainersList = lazy(() => import("./pages/Trainer/TrainersList"));
const DietplanList = lazy(() => import("./pages/Dietplan/DietplanList"));
const EditDietplan = lazy(() => import("./pages/Dietplan/EditDietplan"));
const ViewDietplan = lazy(() => import("./pages/Dietplan/ViewDietplan"));
const SubscriptionPaylist = lazy(() => import("./pages/SubscriptionPaylist"));
const AddWorkoutPlan = lazy(() => import("./pages/Workoutplan/AddWorkoutPlan"));
const ViewWorkoutplan = lazy(() =>
  import("./pages/Workoutplan/ViewWorkoutplan")
);
const EditWorkoutPlan = lazy(() =>
  import("./pages/Workoutplan/EditWorkoutPlan")
);
const WorkoutPlanList = lazy(() =>
  import("./pages/Workoutplan/WorkoutPlanList")
);
const AddSubscription = lazy(() =>
  import("./pages/Subscription/AddSubscription")
);
const EditSubscription = lazy(() =>
  import("./pages/Subscription/EditSubscription")
);
const SubscriptionList = lazy(() =>
  import("./pages/Subscription/SubscriptionList")
);

export const App = () => {
  const { user } = useContext(AuthContext);

  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div style={{ height: "100vh" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "p-3",
        }}
        richColors
      />
      {!user && !isLoginPage && <Navigate to="/login" replace />}
      {user && isLoginPage && <Navigate to="/home" replace />}

      {!isLoginPage ? (
        <div className="flex h-full">
          <Sidebar />
          <div id="main-content-holder" className="px-7">
            <Navbar />
            <div className="py-3">
              <Suspense fallback={<Loader />}>
                <Routes>
                  {/* General */}
                  <Route path="/home" element={<Dashboard />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/payment" element={<SubscriptionPaylist />} />

                  {/* Events */}
                  <Route path="/event" element={<Events />} />
                  <Route path="/event/add" element={<AddEvent />} />

                  {/* Trainer */}
                  <Route path="/trainer/add" element={<AddTrainer />} />
                  <Route path="/trainer/edit" element={<EditTrainer />} />
                  <Route path="/trainer/list" element={<TrainersList />} />

                  {/* Plans */}
                  <Route path="/plan/diet/add" element={<AddDietplan />} />
                  <Route path="/plan/diet/list" element={<DietplanList />} />
                  <Route path="/plan/diet/edit" element={<EditDietplan />} />
                  <Route path="/plan/diet/view" element={<ViewDietplan />} />
                  <Route
                    path="/plan/workout/add"
                    element={<AddWorkoutPlan />}
                  />
                  <Route
                    path="/plan/workout/edit"
                    element={<EditWorkoutPlan />}
                  />
                  <Route
                    path="/plan/workout/list"
                    element={<WorkoutPlanList />}
                  />
                  <Route
                    path="/plan/workout/view"
                    element={<ViewWorkoutplan />}
                  />

                  {/* Members */}
                  <Route path="/member/add" element={<AddMember />} />
                  <Route path="/member/edit" element={<EditMember />} />
                  <Route path="/member/list" element={<MembersList />} />

                  {/* Subscription */}
                  <Route
                    path="/subscription/add"
                    element={<AddSubscription />}
                  />
                  <Route
                    path="/subscription/list"
                    element={<SubscriptionList />}
                  />
                  <Route
                    path="/subscription/edit"
                    element={<EditSubscription />}
                  />

                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </Suspense>
              <Footer />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/login" element={<AuthForm />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </div>
      )}
    </div>
  );
};
