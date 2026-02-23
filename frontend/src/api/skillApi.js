import API from "./axios";

// ================= SKILLS =================

// get skills (pagination + filter + sort)
export const getSkills = (params = {}) =>
  API.get("/skills", { params });

// add skill
export const addSkill = (data) =>
  API.post("/skills", data);

// update skill
export const updateSkill = (id, data) =>
  API.put(`/skills/${id}`, data);

// delete skill
export const deleteSkill = (id) =>
  API.delete(`/skills/${id}`);
