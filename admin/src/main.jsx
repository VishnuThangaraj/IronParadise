import { App } from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { PlanProvider } from "./context/PlanContext";
import { MemberProvider } from "./context/MemberContext";
import { EnquiryProvider } from "./context/EnquiryContext";
import { TrainerProvider } from "./context/TrainerContext";
import { GeneralProvider } from "./context/GeneralContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";

createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <GeneralProvider>
        <TrainerProvider>
          <SubscriptionProvider>
            <PlanProvider>
              <MemberProvider>
                <EnquiryProvider>
                  <App />
                </EnquiryProvider>
              </MemberProvider>
            </PlanProvider>
          </SubscriptionProvider>
        </TrainerProvider>
      </GeneralProvider>
    </AuthProvider>
  </Router>
);
