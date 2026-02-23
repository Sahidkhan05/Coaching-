import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ================= BATCH MAPPING =================

//  Add new batch mapping
export const addBatchMapping = (data) =>
  API.post("/batch-mappings", data);

//  Get batch mappings (filter + sort + pagination)
export const getBatchMappings = (params) =>
  API.get("/batch-mappings", { params });

//  Update batch mapping
export const updateBatchMapping = (id, data) =>
  API.put(`/batch-mappings/${id}`, data);

//  Delete batch mapping
export const deleteBatchMapping = (id) =>
  API.delete(`/batch-mappings/${id}`);


export const getBatchStudents = (params) =>
  API.get("/batch-mappings/students", { params });