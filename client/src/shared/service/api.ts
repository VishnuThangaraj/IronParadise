import axios, { Axios } from "axios";

const baseURL: string = import.meta.env.NODE_SERVER_URL;

const api: Axios = axios.create({
  baseURL: baseURL,
});

export default api;
