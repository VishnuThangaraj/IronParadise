import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from '@tanstack/react-query'

import { BrowserRouter as Router } from "react-router-dom";

import "@/index.css";
import App from "./App.tsx";
import { store } from "@/app/store";
import "@/shared/styles/_global.scss";
import { queryClient } from "@/lib/queryClient.ts";
import { ToastProvider } from "@/shared/components/ui/toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <Router>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Router>
      </ToastProvider>
    </Provider>
  </StrictMode>,
);
