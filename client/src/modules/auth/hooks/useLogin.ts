import { useState, useCallback, type ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/app/store";
import { loginUser } from "@/modules/auth/redux/authThunks";
import initialLoginState, {
  type InitialLoginState,
} from "@/modules/auth/state/initialLoginState";
import {
  validateFields,
  handleChangeValidation,
} from "@/shared/utils/validation";
import loginRules from "@/modules/auth/validation/loginRules";
import { useToast } from "@/shared/components/ui/toast";

import { LOGIN_ATTEMPT_COOKIE_KEY } from "@/modules/auth/constants/login.constants";
import Cookies from "js-cookie";

type LoginField = keyof typeof initialLoginState;

const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [login, setLogin] = useState<InitialLoginState>(initialLoginState);
  const { addToast } = useToast();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const name = e.target.name as LoginField;
      const rules = loginRules[name];

      if (!handleChangeValidation(value, rules, addToast)) return;

      setLogin((prev) => ({
        ...prev,
        [name]: name === "userId" ? value.toUpperCase() : value,
      }));
    },
    [addToast],
  );

  const handleSubmit = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateFields(login, addToast)) return;

      try {
        await dispatch(loginUser(login)).unwrap();
        addToast({ type: "success", message: "Signed in successfully!" });

        Cookies.remove(LOGIN_ATTEMPT_COOKIE_KEY);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : (err as { message?: string })?.message ||
              "User ID or password doesn’t look right";
        addToast({ type: "error", message: errorMessage });
      } finally {
        setLogin(initialLoginState);
      }
    },
    [login, dispatch, addToast],
  );

  return { login, setLogin, handleChange, handleSubmit };
};

export default useLogin;
