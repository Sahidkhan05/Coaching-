
import API from "./axios";

// get visitors (filter, sort, pagination)
export const getVisitors = (params = {}) =>
  API.get("/visitors", { params });

// add visitor
export const addVisitor = (data) =>
  API.post("/visitors", data);

// update visitor (edit / status change)
export const updateVisitor = (id, data) =>
  API.put(`/visitors/${id}`, data);

// move to trash
export const deleteVisitor = (id) =>
  API.delete(`/visitors/${id}`);

// restore visitor
export const restoreVisitor = (id) =>
  API.patch(`/visitors/${id}/restore`);

//  convert visitor → student
export const convertVisitorToStudent = (id, data) => {
  return API.post(`/visitors/convert/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
