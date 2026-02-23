import axios from "./axios"; // 🔥 IMPORTANT

/* ================= SAVE ================= */
export const saveFeedback = async (data) => {
  const res = await axios.post("/feedback", data);
  return res.data;
};

/* ================= GET BY BATCH ================= */
export const getFeedbackByBatch = async (batchId) => {
  const res = await axios.get(`/feedback?batch=${batchId}`);
  return res.data;
};

// ================= STUDENT MY FEEDBACK =================
export const getMyFeedback = async () => {
  const res = await axios.get("/feedback/my");
  return res.data;
};

// ================= TUTOR MY FEEDBACK =================
export const getMyTutorFeedback = async () => {
  const res = await axios.get("/feedback/my-tutor");
  return res.data;
};