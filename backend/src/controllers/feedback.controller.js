const Feedback = require("../models/Feedback");
const Student = require("../models/Student");
const Tutor = require("../models/Tutor");
const Batch = require("../models/Batch");

/* ================= SAVE / UPDATE ================= */
const BatchMapping = require("../models/BatchMapping");

exports.saveFeedback = async (req, res) => {
  try {
    const { course, batch, student, rating, note } = req.body;

    if (!course || !batch || !student || !rating || !note) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔥 Get tutor from BatchMapping
    const mapping = await BatchMapping.findOne({ batch });

    if (!mapping || !mapping.tutor) {
      return res.status(400).json({
        message: "Tutor not assigned to this batch",
      });
    }

    const feedback = await Feedback.findOneAndUpdate(
      { student, batch },
      {
        course,
        batch,
        student,
        tutor: mapping.tutor, // ✅ correct tutor
        rating: Number(rating),
        note,
      },
      { new: true, upsert: true }
    );

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ================= GET BY BATCH (ADMIN/HR) ================= */
exports.getFeedbackByBatch = async (req, res) => {
  try {
    const { batch } = req.query;

    const feedback = await Feedback.find({ batch })
      .populate("student", "name")
      .populate("course", "name")
      .populate("batch", "name")
      .populate("tutor", "name");

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STUDENT MY FEEDBACK ================= */
exports.getMyFeedback = async (req, res) => {
  try {
    const userId = req.user.userId; // 🔥 FIXED (was req.user.id)

    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const feedback = await Feedback.find({
      student: student._id,
    })
      .populate("course", "name")
      .populate("batch", "name")
      .populate("tutor", "name");

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= TUTOR MY FEEDBACK ================= */
exports.getMyTutorFeedback = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tutor = await Tutor.findOne({ userId });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    const feedback = await Feedback.find({
      tutor: tutor._id,
    })
      .populate("student", "name")
      .populate("course", "name")
      .populate("batch", "name");

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};