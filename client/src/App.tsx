import { lazy } from "react";

const AuthPage = lazy(() => import("@/modules/auth/pages/AuthPage"));

const App = () => {
  return (
    <div>
      <AuthPage />
    </div>
  );
};

export default App;
