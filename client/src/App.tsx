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
const Contact = lazy(() => import("@/modules/enquiry/pages/Contact"));
const Dashboard = lazy(() => import("@/modules/dashboard/pages/Dashboard"));
const EventsCalendar = lazy(
  () => import("@/modules/event/pages/EventsCalendar"),
);
const Messages = lazy(() => import("@/modules/messages/pages/Messages"));

// Trainer
const TrainerList = lazy(() => import("@/modules/trainer/pages/TrainerList"));
const TrainerForm = lazy(() => import("@/modules/trainer/pages/TrainerForm"));
const TrainerPayroll = lazy(
  () => import("@/modules/trainer/pages/TrainerPayroll"),
);
const TrainerDetails = lazy(
  () => import("@/modules/trainer/pages/TrainerDetails"),
);

// Member
const MemberList = lazy(() => import("@/modules/member/pages/MemberList"));
const MemberForm = lazy(() => import("@/modules/member/pages/MemberForm"));
const MemberDetails = lazy(
  () => import("@/modules/member/pages/MemberDetails"),
);

// Diet Plan
const DietPlanList = lazy(
  () => import("@/modules/diet-plan/pages/DietPlanList"),
);
const DietPlanForm = lazy(
  () => import("@/modules/diet-plan/pages/DietPlanForm"),
);
const DietPlanDetails = lazy(
  () => import("@/modules/diet-plan/pages/DietPlanDetails"),
);

// Workout Plan
const WorkoutPlanList = lazy(
  () => import("@/modules/workout-plan/pages/WorkoutPlanList"),
);
const WorkoutPlanForm = lazy(
  () => import("@/modules/workout-plan/pages/WorkoutPlanForm"),
);

const WorkoutPlanDetails = lazy(
  () => import("@/modules/workout-plan/pages/WorkoutPlanDetails"),
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
          <Route path="/contact-us" element={<Contact />} />
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
                <Route path="/events" element={<EventsCalendar />} />
                <Route path="/message" element={<Messages />} />

                {/* Member */}
                <Route path="/member/add" element={<MemberForm />} />
                <Route path="/member/list" element={<MemberList />} />
                <Route path="/member/:memberId" element={<MemberDetails />} />
                <Route path="/member/edit/:memberId" element={<MemberForm />} />

                {/* Trainer */}
                <Route path="/trainer/add" element={<TrainerForm />} />
                <Route path="/trainer/list" element={<TrainerList />} />
                <Route path="/trainer/payroll" element={<TrainerPayroll />} />
                <Route path="/trainer/:userId" element={<TrainerDetails />} />
                <Route path="/trainer/edit/:userId" element={<TrainerForm />} />

                {/* Diet Plan */}
                <Route path="/plan/diet/add" element={<DietPlanForm />} />
                <Route path="/plan/diet/list" element={<DietPlanList />} />
                <Route
                  path="/plan/diet/edit/:planId"
                  element={<DietPlanForm />}
                />
                <Route
                  path="/plan/diet/:planId"
                  element={<DietPlanDetails />}
                />

                {/* Workout Plan */}
                <Route
                  path="/plan/workout/list"
                  element={<WorkoutPlanList />}
                />
                <Route path="/plan/workout/add" element={<WorkoutPlanForm />} />
                <Route
                  path="/plan/workout/edit/:planId"
                  element={<WorkoutPlanForm />}
                />
                <Route
                  path="/plan/workout/:planId"
                  element={<WorkoutPlanDetails />}
                />

                {/* Membership Plan */}
                <Route
                  path="/membership/list"
                  element={<MembershipPlanList />}
                />
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
