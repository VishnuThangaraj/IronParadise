import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useMemo, Suspense, lazy, Fragment } from "react";

import "./App.scss";

import Loader from "./components/Loader";
import Footer from "./components/Footer";
import LoginPage from "./pages/Login/AuthForm";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

import { fetchUser } from "./redux/auth/authThunks";
import { selectUser, selectToken } from "./redux/auth/authSelectors";

// Lazy-loaded pages

const Events = lazy(() => import("./pages/Event/Events"));
const AddEvent = lazy(() => import("./pages/Event/AddEvent"));
const Message = lazy(() => import("./pages/Message/Message"));
const AddMember = lazy(() => import("./pages/Member/AddMember"));
const AddTrainer = lazy(() => import("./pages/Trainer/AddTrainer"));
const MembersList = lazy(() => import("./pages/Member/MembersList"));
const AddDietPlan = lazy(() => import("./pages/DietPlan/AddDietPlan"));
const TrainersList = lazy(() => import("./pages/Trainer/TrainersList"));
const MemberDetails = lazy(() => import("./pages/Member/MemberDetails"));
const DietPlanList = lazy(() => import("./pages/DietPlan/DietPlanList"));
const TrainerDetails = lazy(() => import("./pages/Trainer/TrainerDetails"));
const DietPlanDetails = lazy(() => import("./pages/DietPlan/DietPlanDetails"));
const MembershipList = lazy(() => import("./pages/Membership/MembershipList"));
const AddWorkoutPlan = lazy(() => import("./pages/WorkoutPlan/AddWorkoutPlan"));
const AdminDashborard = lazy(() => import("./pages/Dashboard/AdminDashborard"));
const WorkoutPlanList = lazy(
  () => import("./pages/WorkoutPlan/WorkoutPlanList"),
);
const WorkoutPlanDetails = lazy(
  () => import("./pages/WorkoutPlan/WorkoutPlanDetails"),
);
const AddMembership = lazy(
  () => import("./pages/MembershipPlan/AddMembershipPlan"),
);
const MembershipPlan = lazy(
  () => import("./pages/MembershipPlan/MembershipPlanList"),
);
const MembershipPlanDetails = lazy(
  () => import("./pages/MembershipPlan/MembershipPlanDetails"),
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
          <Fragment>
            <Sidebar />
            <div id="main-content-holder">
              <Navbar />
              <div
                id="main-content-origin"
                className="flex flex-col justify-between pt-6 px-5 h-full overflow-y-auto"
              >
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />

                    {/* General */}
                    <Route path="/home" element={<AdminDashborard />} />

                    {/* Events */}
                    <Route path="/events/view" element={<Events />} />
                    <Route path="/events/add" element={<AddEvent />} />

                    {/* Trainer */}
                    <Route path="/trainer/add" element={<AddTrainer />} />
                    <Route path="/trainer/list" element={<TrainersList />} />
                    <Route
                      path="/trainer/details/:id"
                      element={<TrainerDetails />}
                    />

                    {/* Member */}
                    <Route path="/member/add" element={<AddMember />} />
                    <Route path="/member/list" element={<MembersList />} />
                    <Route
                      path="/member/details/:id"
                      element={<MemberDetails />}
                    />

                    {/* Membership */}
                    <Route path="/payment" element={<MembershipList />} />

                    {/* Membership Plan */}
                    <Route
                      path="/subscription/add"
                      element={<AddMembership />}
                    />
                    <Route
                      path="/subscription/list"
                      element={<MembershipPlan />}
                    />
                    <Route
                      path="/subscription/details/:id"
                      element={<MembershipPlanDetails />}
                    />

                    {/* Fitness Plan */}
                    <Route path="/plan/diet/list" element={<DietPlanList />} />
                    <Route
                      path="/plan/diet/details/:id"
                      element={<DietPlanDetails />}
                    />
                    <Route path="/plan/diet/add" element={<AddDietPlan />} />
                    <Route
                      path="/plan/workout/list"
                      element={<WorkoutPlanList />}
                    />
                    <Route
                      path="/plan/workout/details/:id"
                      element={<WorkoutPlanDetails />}
                    />
                    <Route
                      path="/plan/workout/add"
                      element={<AddWorkoutPlan />}
                    />

                    {/* Messages */}
                    <Route path="/message" element={<Message />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </Routes>
                </Suspense>

                <Footer />
              </div>
            </div>
          </Fragment>
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
