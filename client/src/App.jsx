import { Toaster } from "sonner";
import { Suspense, lazy } from "react";
import { Loader } from "./components/Loader";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy-Loaded pages
const UserAttendance = lazy(() => import("./pages/UserAttendance"));

const App = () => {
  return (
    <div style={{ width: "100%" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "p-3",
        }}
        richColors
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* General */}
          <Route path="/home" element={<UserAttendance />} />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
