import { App } from "./App.jsx";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { TrainerProvider } from "./context/TrainerContext.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <TrainerProvider>
        <App />
      </TrainerProvider>
    </AuthProvider>
  </Router>
);
