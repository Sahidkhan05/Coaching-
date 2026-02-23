const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
     tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate feedback per student per batch
feedbackSchema.index({ student: 1, batch: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", feedbackSchema);