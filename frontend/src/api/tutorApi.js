import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 token attach
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ================= TUTORS =================

// GET tutors (pagination + search + filter + sort)
export const getTutors = (params = {}) =>
  API.get("/tutors", { params });

// NEW - GET tutors by course
export const getTutorsByCourse = (courseId) =>
  API.get(`/tutors/by-course/${courseId}`);

// ADD tutor
export const addTutor = (data) =>
  API.post("/tutors", data);

// UPDATE tutor
export const updateTutor = (id, data) =>
  API.put(`/tutors/${id}`, data);

// DELETE tutor
export const deleteTutor = (id) =>
  API.delete(`/tutors/${id}`);