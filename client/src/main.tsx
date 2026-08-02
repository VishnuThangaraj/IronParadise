import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.tsx";

import "@/index.css";
import { store } from "@/app/store";
import "@/shared/styles/_global.scss";
import { ToastProvider } from "@/shared/components/ui/toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <Router>
          <App />
        </Router>
      </ToastProvider>
    </Provider>
  </StrictMode>,
);
