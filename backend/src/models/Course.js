const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: String,
  fees: Number,
  skills: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
