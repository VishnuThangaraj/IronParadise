import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { createContext, useState, useEffect, useCallback } from "react";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const currentDate = getCurrentDate();
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Load User Info
  const fetchUser = useCallback(async () => {
    if (token) {
      try {
        const response = await axios.get("auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUser(response.data);
          if (response.data.role === "admin") navigate("/home");
          else navigate("/pfd");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error.message);
        logout();
      }
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post("auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        setToken(token);
        await fetchUser();
        toast.success("Login Successful");
      } else {
        toast.error("Invalid Credentials Provided");
      }
    } catch (error) {
      toast.error("Invalid Credentials Provided");
      handleError(error);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    navigate("/login");
  };

  // Error Handling Function
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Invalid credentials");
      } else if (error.response.status === 409) {
        console.error("Email already in use");
      } else if (error.response.status === 500) {
        console.error("Server error", error);
      } else {
        console.error("Unexpected error:", error.response.data.message);
      }
    } else if (error.request) {
      console.error("No response received from server");
    } else {
      console.error("Error setting up request:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, currentDate }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
