import { App } from "./App.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { TrainerProvider } from "./context/TrainerContext.jsx";
import { GeneralProvider } from "./context/GeneralContext.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <GeneralProvider>
        <TrainerProvider>
          <App />
        </TrainerProvider>
      </GeneralProvider>
    </AuthProvider>
  </Router>
);
