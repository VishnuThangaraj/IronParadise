import { Toaster } from "sonner";
import { Suspense, lazy } from "react";
import { Loader } from "./components/Loader";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy-Loaded pages
const Home = lazy(() => import("./pages/Home"));
const Enquiry = lazy(() => import("./pages/Enquiry"));

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
          <Route path="/home" element={<Home />} />
          <Route path="/enquiry" element={<Enquiry />} />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
