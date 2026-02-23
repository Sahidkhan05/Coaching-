const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true },

  mobile: { type: String, required: true },

  role: {
    type: String,
    enum: ["Visitor", "Student", "Tutor"],
    default: "Visitor",
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },

  source: {
    type: String,
    enum: ["Walk-in", "Call", "Referral", "Online"],
    default: "Walk-in",
  },

  visitDate: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["Active", "Follow-up", "Converted", "Not Interested"],
    default: "Active",
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Visitor", visitorSchema);
