import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ================= COURSES =================

//  GET courses with filter / sorting / pagination
export const getCourses = (params) =>
  API.get("/courses", { params });

//  ADD course
export const addCourse = (data) =>
  API.post("/courses", data);

//  UPDATE course
export const updateCourse = (id, data) =>
  API.put(`/courses/${id}`, data);

//  DELETE course
export const deleteCourse = (id) =>
  API.delete(`/courses/${id}`);
