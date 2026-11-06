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
import RoleRoute from "@/shared/components/layout/RoleRoute";

const AuthPage = lazy(() => import("@/modules/auth/pages/AuthPage"));
const Contact = lazy(() => import("@/modules/enquiry/pages/Contact"));
const Enquiry = lazy(() => import("@/modules/enquiry/pages/Enquiry"));
const Dashboard = lazy(() => import("@/modules/dashboard/pages/Dashboard"));
const EventsCalendar = lazy(
  () => import("@/modules/event/pages/EventsCalendar"),
);
const Messages = lazy(() => import("@/modules/messages/pages/Messages"));

// Attendance
const Attendance = lazy(() => import("@/modules/attendance/pages/Attendance"));
const AttendanceEntry = lazy(
  () => import("@/modules/attendance/pages/AttendanceEntry"),
);

// Trainer
const TrainerList = lazy(() => import("@/modules/trainer/pages/TrainerList"));
const TrainerForm = lazy(() => import("@/modules/trainer/pages/TrainerForm"));
const TrainerPayroll = lazy(
  () => import("@/modules/trainer/pages/TrainerPayroll"),
);
const TrainerDetails = lazy(
  () => import("@/modules/trainer/pages/TrainerDetails"),
);
const TrainerAssignedMembers = lazy(
  () => import("@/modules/trainer/pages/TrainerAssignedMembers"),
);
const TrainerAssignedMembersAttendance = lazy(
  () => import("@/modules/trainer/pages/TrainerAssignedMembersAttendance"),
);

// Member
const MemberList = lazy(() => import("@/modules/member/pages/MemberList"));
const MemberForm = lazy(() => import("@/modules/member/pages/MemberForm"));
const MemberDetails = lazy(
  () => import("@/modules/member/pages/MemberDetails"),
);
const MembershipPaylist = lazy(
  () => import("@/modules/member/pages/MembershipPaylist"),
);
const MemberAttendanceView = lazy(
  () => import("@/modules/member/pages/MemberAttendanceView"),
);
const MemberTrainerProfileView = lazy(
  () => import("@/modules/member/pages/MemberTrainerProfileView"),
);
const MemberFitnessPlansView = lazy(
  () => import("@/modules/member/pages/MemberFitnessPlansView"),
);
const MemberMembershipView = lazy(
  () => import("@/modules/member/pages/MemberMembershipView"),
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
          <Route path="/attendance-kiosk" element={<AttendanceEntry />} />
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
                {/* General / Shared */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/events" element={<EventsCalendar />} />
                <Route path="/message" element={<Messages />} />

                {/* Admin Only */}
                <Route
                  path="/enquiry"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <Enquiry />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/payment"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <MembershipPaylist />
                    </RoleRoute>
                  }
                />

                {/* Member Management */}
                <Route
                  path="/member/add"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <MemberForm />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/member/edit/:memberId"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <MemberForm />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/member/list"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <MemberList />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/member/:memberId"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <MemberDetails />
                    </RoleRoute>
                  }
                />

                {/* Member Role Self-Service Routes */}
                <Route
                  path="/member/my-attendance"
                  element={
                    <RoleRoute allowedRoles={["member", "admin"]}>
                      <MemberAttendanceView />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/member/my-trainer"
                  element={
                    <RoleRoute allowedRoles={["member", "admin"]}>
                      <MemberTrainerProfileView />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/member/my-plans"
                  element={
                    <RoleRoute allowedRoles={["member", "admin"]}>
                      <MemberFitnessPlansView />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/member/my-membership"
                  element={
                    <RoleRoute allowedRoles={["member", "admin"]}>
                      <MemberMembershipView />
                    </RoleRoute>
                  }
                />

                {/* Trainer Management */}
                {/* Trainer Role Routes */}
                <Route
                  path="/trainer/my-members"
                  element={
                    <RoleRoute allowedRoles={["trainer", "admin"]}>
                      <TrainerAssignedMembers />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/trainer/members-attendance"
                  element={
                    <RoleRoute allowedRoles={["trainer", "admin"]}>
                      <TrainerAssignedMembersAttendance />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/trainer/add"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <TrainerForm />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/trainer/payroll"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <TrainerPayroll />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/trainer/edit/:userId"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <TrainerForm />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/trainer/list"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <TrainerList />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/trainer/:userId"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <TrainerDetails />
                    </RoleRoute>
                  }
                />

                {/* Attendance Management */}
                <Route
                  path="/attendance"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <Attendance />
                    </RoleRoute>
                  }
                />

                {/* Diet Plan */}
                <Route
                  path="/plan/diet/add"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <DietPlanForm />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/plan/diet/list"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <DietPlanList />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/plan/diet/edit/:planId"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <DietPlanForm />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/plan/diet/:planId"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <DietPlanDetails />
                    </RoleRoute>
                  }
                />

                {/* Workout Plan */}
                <Route
                  path="/plan/workout/list"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <WorkoutPlanList />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/plan/workout/add"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <WorkoutPlanForm />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/plan/workout/edit/:planId"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <WorkoutPlanForm />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/plan/workout/:planId"
                  element={
                    <RoleRoute allowedRoles={["admin", "trainer"]}>
                      <WorkoutPlanDetails />
                    </RoleRoute>
                  }
                />

                {/* Membership Plan */}
                <Route
                  path="/membership/list"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <MembershipPlanList />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/membership/add"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <MembershipPlanForm />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/membership/edit/:planId"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <MembershipPlanForm />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/membership/:planId"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <MembershipPlanDetails />
                    </RoleRoute>
                  }
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
