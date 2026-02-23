import API from "./axios";

/* ================= GET FEES ================= */
export const getFees = (params = {}) =>
  API.get("/fees", { params });

/* ================= CREATE FEE ================= */
export const addFee = (data) =>
  API.post("/fees", data);

/* ================= ADD INSTALLMENT ================= */
export const addInstallment = (id, data) =>
  API.put(`/fees/${id}/installment`, data);

/* ================= DELETE FULL FEE ================= */
export const deleteFee = (id) =>
  API.delete(`/fees/${id}`);

/* ================= DELETE INSTALLMENT ================= */
export const deleteInstallment = (feeId, installmentId) =>
  API.delete(`/fees/${feeId}/installment/${installmentId}`);

/* ================= STUDENT MY FEES ================= */
export const getMyFees = () =>
  API.get("/fees/my");