const mongoose = require("mongoose");

const batchMappingSchema = new mongoose.Schema(
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
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
       ref: "Tutor",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

//  prevent duplicate batch mapping for same course
batchMappingSchema.index({ course: 1, batch: 1 }, { unique: true });

module.exports = mongoose.model("BatchMapping", batchMappingSchema);
