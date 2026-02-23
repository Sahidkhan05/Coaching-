const TimeTable = require("../models/TimeTable");
const Student = require("../models/Student");
const Tutor = require("../models/Tutor");
const BatchMapping = require("../models/BatchMapping");

/* ================= CREATE ================= */
exports.createTimeTable = async (req, res) => {
  try {
    const { course, batch, tutor, slots, description } = req.body;

    if (!course || !batch || !tutor || !slots?.length) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const createdSlots = [];

    for (let slot of slots) {

      if (!slot.startTime || !slot.endTime) {
        return res.status(400).json({
          message: `Time missing for ${slot.day}`,
        });
      }

      if (slot.endTime <= slot.startTime) {
        return res.status(400).json({
          message: `Invalid time range for ${slot.day}`,
        });
      }

      // 🔥 Conflict check per day
      const conflict = await TimeTable.findOne({
        batch,
        day: slot.day,
        startTime: { $lt: slot.endTime },
        endTime: { $gt: slot.startTime },
      });

      if (conflict) {
        return res.status(400).json({
          message: `Time conflict detected on ${slot.day}`,
        });
      }

      const newSlot = await TimeTable.create({
        course,
        batch,
        tutor,
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        description,
      });

      createdSlots.push(newSlot);
    }

    res.status(201).json(createdSlots);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN FILTER ================= */
exports.getTimeTables = async (req, res) => {
  try {
    console.log("QUERY:", req.query);

    const { batch } = req.query;

    if (!batch) {
      return res.status(400).json({ message: "Batch required" });
    }

    const timetables = await TimeTable.find({ batch })
      .populate("course", "name")
      .populate("batch", "name")
      .populate("tutor", "name");

    console.log("RESULT:", timetables);

    res.json(timetables);

  } catch (err) {
    console.error("GET TIMETABLE ERROR:", err); // 🔥 ADD THIS
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateTimeTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime, batch } = req.body;

    if (endTime <= startTime) {
      return res.status(400).json({ message: "Invalid time range" });
    }

    const conflict = await TimeTable.findOne({
      _id: { $ne: id },
      batch,
      day,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (conflict) {
      return res.status(400).json({
        message: "Time conflict detected",
      });
    }

    const updated = await TimeTable.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= DELETE ================= */
exports.deleteTimeTable = async (req, res) => {
  try {
    await TimeTable.findByIdAndDelete(req.params.id);
    res.json({ message: "TimeTable deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= TUTOR DASHBOARD ================= */
exports.getMyTutorTimeTable = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ userId: req.user.userId });

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor record not found",
      });
    }

    const timetables = await TimeTable.find({
      tutor: tutor._id,
    })
      .populate("course", "name")
      .populate("batch", "name");

    res.json(timetables);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= STUDENT DASHBOARD ================= */
exports.getMyStudentTimeTable = async (req, res) => {
  try {
    const student = await Student.findOne({
      userId: req.user.userId,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const mapping = await BatchMapping.findOne({
      students: student._id,
    });

    if (!mapping) {
      return res.json([]);
    }

    const timetables = await TimeTable.find({
      batch: mapping.batch,
    })
      .populate("course", "name")
      .populate("batch", "name")
      .populate("tutor", "name");

    res.json(timetables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
