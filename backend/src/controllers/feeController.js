const Fee = require("../models/Fee");
const Student = require("../models/Student");

/* ================= CREATE FEE ================= */
exports.createFee = async (req, res) => {
  try {
    const { student, course, batch, totalFees } = req.body;

    const existing = await Fee.findOne({ student });
    if (existing) {
      return res.status(400).json({
        message: "Fee record already exists for this student",
      });
    }

    const fee = await Fee.create({
      student,
      course,
      batch,
      totalFees,
      totalPaid: 0,
      pendingAmount: totalFees,
      installments: [],
    });

    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADD INSTALLMENT ================= */
exports.addInstallment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMode } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const fee = await Fee.findById(id);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    if (amount > fee.pendingAmount) {
      return res.status(400).json({
        message: "Amount exceeds pending balance",
      });
    }

    fee.installments.push({
      amount,
      paymentMode,
      paymentDate: new Date(),
    });

    fee.totalPaid += Number(amount);
    fee.pendingAmount = fee.totalFees - fee.totalPaid;

    await fee.save();

    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET FEES ================= */
exports.getFees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { "student.name": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const data = await Fee.find(query)
      .populate("student", "name mobile")
      .populate("course", "name")
      .populate("batch", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Fee.countDocuments(query);

    res.json({
      data,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE INSTALLMENT ================= */
exports.deleteInstallment = async (req, res) => {
  try {
    const { feeId, installmentId } = req.params;

    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    const installment = fee.installments.id(installmentId);
    if (!installment)
      return res.status(404).json({ message: "Installment not found" });

    fee.totalPaid -= installment.amount;
    fee.pendingAmount = fee.totalFees - fee.totalPaid;

    installment.deleteOne();
    await fee.save();

    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE FULL FEE ================= */
exports.deleteFee = async (req, res) => {
  try {
    const { id } = req.params;

    const fee = await Fee.findByIdAndDelete(id);

    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    res.json({ message: "Fee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= STUDENT MY FEES =================
exports.getMyFees = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Decoded User:", req.user);

    const student = await Student.findOne({ userId });
    console.log("Decoded User:", req.user);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const fees = await Fee.find({
      student: student._id,
    })
      .populate("course")
      .populate("batch");

    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};