const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();

connectDB();


require("./models/user.model")
require("./models/Tutor");
require("./models/Student");
require("./models/Course");
require("./models/Batch");
require("./models/BatchMapping");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Coaching Backend Running 🚀");
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/visitors", require("./routes/visitorRoutes"));
app.use("/api/tutors", require("./routes/tutorRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/batches", require("./routes/batchRoutes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/fees", require("./routes/feeRoutes"));
app.use("/api/batch-mappings", require("./routes/batchMapping.routes"));
app.use("/api/timetables", require("./routes/timeTable.routes"));
app.use("/api/reports", require("./routes/report.routes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/feedback", require("./routes/feedback.routes"));

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});