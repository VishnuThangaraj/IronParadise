import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "@/App";
import { store } from "@/app/store";
import AppToaster from "@/shared/components/ui/AppToaster";

import "@/index.css";
import "@/shared/styles/_global.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
        <AppToaster />
      </Router>
    </Provider>
  </React.StrictMode>,
);
