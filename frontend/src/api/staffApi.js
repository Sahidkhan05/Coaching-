import axios from "axios";

const BASE_URL = "http://localhost:5000/api/staff";

// Token automatically attach (agar interceptor nahi hai to ye use karo)
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ================= ADD ================= */
export const addStaff = async (data) => {
  const res = await axios.post(BASE_URL, data, getAuthHeader());
  return res.data;
};

/* ================= GET (SEARCH + PAGINATION) ================= */
export const getStaffs = async (params) => {
  const res = await axios.get(BASE_URL, {
    ...getAuthHeader(),
    params,
  });
  return res.data;
};

/* ================= UPDATE ================= */
export const updateStaff = async (id, data) => {
  const res = await axios.put(
    `${BASE_URL}/${id}`,
    data,
    getAuthHeader()
  );
  return res.data;
};

/* ================= DELETE ================= */
export const deleteStaff = async (id) => {
  const res = await axios.delete(
    `${BASE_URL}/${id}`,
    getAuthHeader()
  );
  return res.data;
};