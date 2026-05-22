import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

import "@/index.css";
import App from "@/App";
import { store } from "@/app/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
        <Toaster richColors position="top-right" />
      </Router>
    </Provider>
  </React.StrictMode>,
);
