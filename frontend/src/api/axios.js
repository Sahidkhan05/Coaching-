import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 AUTO TOKEN ATTACH
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 👈 same key as login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
