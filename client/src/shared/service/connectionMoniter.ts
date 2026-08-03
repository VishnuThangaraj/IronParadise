import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/app/store";
import { useEffect } from "react";

import { ping } from "@/shared/api/connectionAPI";
import { setOnline } from "@/shared/redux/server-status/serverStatusSlice";

export const useConnectionMoniter = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await ping();
        dispatch(setOnline(true));
      } catch (error) {
        console.error("Server connection check failed:", error);
        dispatch(setOnline(false));
      }
    };

    checkConnection();

    const intervalId = setInterval(checkConnection, 120000);

    return () => clearInterval(intervalId);
  }, [dispatch]);
};
