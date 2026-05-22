import axios from "@/service/api";

// Login Admin
export const adminLogin = async ({ email, password }) => {
  const res = await axios.post("auth/admin/login", {
    email,
    password,
  });
  return res.data;
};

// Fetch Current Admin
export const fetchCurrentAdmin = async ({ token }) => {
  const res = await axios.get("auth/admin/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// Logout Admin
export const adminLogout = async () => {
  localStorage.removeItem("token");
  return;
};
