import { useEffect } from "react";
import { useDispatch } from "react-redux";

import api from "@/service/api";
import { setOnline } from "@/shared/redux/serverStatus/serverStatusSlice";

export const useConnectionMonitor = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await api.get("/");
        dispatch(setOnline(true));
      } catch (error) {
        if (error.response) {
          dispatch(setOnline(true));
        } else {
          dispatch(setOnline(false));
        }
      }
    };

    checkConnection();

    const intervalId = setInterval(checkConnection, 120000);

    return () => clearInterval(intervalId);
  }, [dispatch]);
};
