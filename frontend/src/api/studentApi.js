import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ================= STUDENTS =================

//  GET students with filter / sorting / pagination
export const getStudents = (params) =>
  API.get("/students", { params });

//  ADD student
export const addStudent = (data) =>
  API.post("/students", data);

//  UPDATE student
export const updateStudent = (id, data) =>
  API.put(`/students/${id}`, data);

//  DELETE student
export const deleteStudent = (id) =>
  API.delete(`/students/${id}`);
