import API from "./axios";

// CREATE
export const createTimeTable = (data) => {
  return API.post("/timetables", data);
};

// GET (by course & batch)
export const getTimeTables = (params) => {
  return API.get("/timetables", { params });
};

// UPDATE
export const updateTimeTable = (id, data) => {
  return API.put(`/timetables/${id}`, data);
};

// DELETE
export const deleteTimeTable = (id) => {
  return API.delete(`/timetables/${id}`);
};
