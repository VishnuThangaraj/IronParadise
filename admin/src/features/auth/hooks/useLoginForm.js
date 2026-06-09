import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import toast from "react-hot-toast";
import Cookies from "js-cookie";

import loginRules from "@/features/auth/validation/loginRules";
import { adminEmail } from "@/config/appConfig";
import { loginAdmin } from "@/features/auth/redux/authThunks";
import initialLoginState from "@/features/auth/state/initialLoginState";
import {
  handleChangeValidation,
  validateFields,
} from "@/shared/utils/FormFieldValidation";

const maxIncorrectAttempt = 10;

const COOKIE_KEY = "user_incorrect_attempts";

const getAttemptsData = () => {
  const data = Cookies.get(COOKIE_KEY);

  if (!data) {
    return { count: 0, firstAttemptTime: null };
  }

  try {
    return JSON.parse(data);
  } catch {
    Cookies.remove(COOKIE_KEY);
    return { count: 0, firstAttemptTime: null };
  }
};

const isExpired = (timestamp) => {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  return Date.now() - timestamp > TWENTY_FOUR_HOURS;
};

const useLoginForm = () => {
  const dispatch = useDispatch();

  const [attemptData, setAttemptData] = useState(() => {
    const data = getAttemptsData();

    // Reset after 24 hours
    if (data.firstAttemptTime && isExpired(data.firstAttemptTime)) {
      Cookies.remove(COOKIE_KEY);

      return {
        count: 0,
        firstAttemptTime: null,
      };
    }

    return data;
  });

  const [login, setLogin] = useState(initialLoginState);

  const handleChange = useCallback((name, value) => {
    const rules = loginRules[name];

    if (!handleChangeValidation(value, rules)) return;

    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateFields(login)) return;

      if (attemptData.count >= maxIncorrectAttempt) {
        toast.error("Too many failed attempts. Try again after 24 hours.");
        return;
      }

      try {
        await dispatch(loginAdmin(login)).unwrap();

        toast.success("Login successful");
        Cookies.remove(COOKIE_KEY);

        setAttemptData({
          count: 0,
          firstAttemptTime: null,
        });
      } catch (error) {
        setAttemptData((prev) => {
          const nextData = {
            count: prev.count + 1,
            firstAttemptTime: prev.firstAttemptTime || Date.now(),
          };

          Cookies.set(COOKIE_KEY, JSON.stringify(nextData), {
            expires: 1,
          });

          return nextData;
        });

        toast.error(error);
      } finally {
        setLogin(initialLoginState);
      }
    },
    [login, attemptData.count, dispatch],
  );

  const contactAdmin = useCallback(() => {
    window.location.href = `mailto:${adminEmail}`;
  }, []);

  return {
    login,
    setLogin,
    contactAdmin,
    incorrectTry: attemptData.count,
    handleChange,
    handleSubmit,
    maxIncorrectAttempt,
  };
};

export default useLoginForm;
