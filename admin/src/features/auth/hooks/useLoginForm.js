import { useState } from "react";
import { useDispatch } from "react-redux";

import { toast } from "sonner";

import loginRules from "@/features/auth/validation/loginRules";
import { loginAdmin } from "@/features/auth/redux/authThunks";
import initialLoginState from "@/features/auth/state/initialLoginState";
import {
  handleChangeValidation,
  validateFields,
} from "@/shared/utils/formFieldValidation";

const useLoginForm = () => {
  const dispatch = useDispatch();

  const [login, setLogin] = useState(initialLoginState);

  const handleChange = (name, value) => {
    const rules = loginRules[name];

    if (!handleChangeValidation(value, rules)) return;

    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields(login)) return;

    try {
      await dispatch(loginAdmin(login)).unwrap();
      toast.success("Login successful");
    } catch (error) {
      toast.error(error);
    }
  };

  return {
    login,
    setLogin,
    handleChange,
    handleSubmit,
  };
};

export default useLoginForm;
