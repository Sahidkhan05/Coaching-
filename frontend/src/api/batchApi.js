import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getBatches = () => API.get("/batches");
export const addBatch = (data) => API.post("/batches", data);

export const updateBatch = (id, data) =>
  API.put(`/batches/${id}`, data);

export const deleteBatch = (id) =>
  API.delete(`/batches/${id}`);
