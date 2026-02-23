const Attendance = require("../models/Attendance");

/* ================= SAVE / UPDATE ================= */
exports.saveAttendance = async (req, res) => {
  try {
    const { course, batch, date, students } = req.body;

    if (!course || !batch || !date || !students?.length) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // 🔥 Range based check (Important Fix)
    const existingAttendance = await Attendance.findOne({
      batch,
      date: { $gte: start, $lte: end },
    });

    if (existingAttendance) {
      existingAttendance.students = students;
      await existingAttendance.save();

      return res.status(200).json({
        message: "Attendance updated successfully",
        attendance: existingAttendance,
      });
    }

    const attendance = await Attendance.create({
      course,
      batch,
      date: start,
      students,
    });

    res.status(201).json({
      message: "Attendance saved successfully",
      attendance,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


/* ================= GET BY BATCH ================= */
exports.getAttendanceByBatch = async (req, res) => {
  try {
    const { batch } = req.query;

    if (!batch) {
      return res.status(400).json({
        message: "Batch is required",
      });
    }

    const attendance = await Attendance.find({ batch })
      .populate("course", "name")
      .populate("batch", "name")
      .populate("students.student", "name");

    res.status(200).json(attendance);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


/* ================= GET BY DATE ================= */
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { batch, date } = req.query;

    if (!batch || !date) {
      return res.status(400).json({
        message: "Batch and date required",
      });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      batch,
      date: { $gte: start, $lte: end },
    }).populate("students.student", "name");

    if (!attendance) {
      return res.status(404).json({
        message: "No attendance found for this date",
      });
    }

    res.status(200).json(attendance);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


