const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
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
  },
  { timestamps: true }
);

/* ================= VALIDATION ================= */
// Modern Mongoose way (No next function)
batchSchema.pre("save", function () {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    throw new Error("End date cannot be before start date");
  }
});

module.exports = mongoose.model("Batch", batchSchema);
