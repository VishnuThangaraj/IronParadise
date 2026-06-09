import axios from "@/service/api";

// Update Admin Profile
export const updateProfile = async ({ name, email, phone }, token) => {
  const res = await axios.put(
    "auth/admin/profile",
    {
      name,
      email,
      phone,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

// Update Admin Password
export const updatePassword = async ({ current, new: newPassword }, token) => {
  const res = await axios.put(
    "auth/admin/password",
    {
      current,
      new: newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
