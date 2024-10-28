import { App } from "./App.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { PlanProvider } from "./context/PlanContext.jsx";
import { MemberProvider } from "./context/MemberContext.jsx";
import { TrainerProvider } from "./context/TrainerContext.jsx";
import { GeneralProvider } from "./context/GeneralContext.jsx";
import { SubscriptionProvider } from "./context/SubscriptionContext.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <GeneralProvider>
        <TrainerProvider>
          <SubscriptionProvider>
            <PlanProvider>
              <MemberProvider>
                <App />
              </MemberProvider>
            </PlanProvider>
          </SubscriptionProvider>
        </TrainerProvider>
      </GeneralProvider>
    </AuthProvider>
  </Router>
);
