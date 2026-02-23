const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ["Cash", "UPI", "Bank"],
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
});

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true, // 🔥 One fee record per student
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      
    },
    totalFees: {
      type: Number,
      required: true,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
    },
    installments: [installmentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Fee || mongoose.model("Fee", feeSchema);
