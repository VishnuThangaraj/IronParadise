import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Loader from "@/shared/components/Loader";

const AuthPage = lazy(() => import("@/features/auth/pages/AuthPage"));

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
