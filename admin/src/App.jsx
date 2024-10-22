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

export const App = () => {
  const { user } = useContext(AuthContext);

  const isLoginPage = useLocation().pathname === "/login";

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
          <div id="main-content-holder">
            <Navbar />
            <div style={{ flex: 1, padding: "1.5%" }}>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/home" element={<Dashboard />} />
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
