import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: baseURL,
});

export default api;
