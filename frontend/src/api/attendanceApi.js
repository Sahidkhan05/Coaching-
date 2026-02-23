import axios from "./axios";

/* ================= COURSES ================= */
export const getCourses = async () => {
  const res = await axios.get("/courses");

  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data.courses)) return res.data.courses;

  return [];
};
/* ================= BATCHES ================= */
export const getBatchesByCourse = async (courseId) => {
  const res = await axios.get(`/batches?course=${courseId}`);

  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data.batches)) return res.data.batches;

  return [];
};

/* ================= STUDENTS ================= */
export const getBatchStudents = async (courseId, batchId) => {
  const res = await axios.get(
    `/batch-mappings/students?course=${courseId}&batch=${batchId}`
  );

  return res.data.data || [];
};

/* ================= SAVE ATTENDANCE ================= */
export const saveAttendance = async (payload) => {
  const res = await axios.post("/attendance/save", payload);
  return res.data;
};

/* ================= GET BY DATE ================= */
export const getAttendanceByDate = async (batchId, date) => {
  const res = await axios.get(
    `/attendance/by-date?batch=${batchId}&date=${date}`
  );
  return res.data;
};


/* ================= GET TIMETABLE BY BATCH ================= */
export const getTimeTablesByBatch = async (batchId) => {
  const res = await axios.get(`/timetables?batch=${batchId}`);

  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data.data)) return res.data.data;

  return [];
};
