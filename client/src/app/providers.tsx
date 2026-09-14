import { type ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { store } from "@/app/store";
import { queryClient } from "@/app/queryClient";
import { ToastProvider } from "@/shared/components/ui/toast";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router>{children}</Router>
        </ToastProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default AppProviders;
