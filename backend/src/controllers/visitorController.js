const Visitor = require("../models/Visitor");
const Student = require("../models/Student");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const sendConfirmationEmail = require("../utils/sendEmail");
const Fee = require("../models/Fee");

// ================= ADD VISITOR =================
exports.addVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.create(req.body);
    res.status(201).json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET VISITORS =================
exports.getVisitors = async (req, res) => {
  try {
    const {
      status,
      search,
      trash,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};
    query.isDeleted = trash === "true";

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const data = await Visitor.find(query)
      .populate("course", "name")
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Visitor.countDocuments(query);

    res.json({
      data,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE VISITOR (NORMAL EDIT) =================
exports.updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= CONVERT VISITOR → STUDENT =================
exports.convertVisitorToStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { admissionAmount, paymentMode } = req.body;

    const visitor = await Visitor.findById(id).populate("course");
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    if (visitor.status === "Converted") {
      return res.status(400).json({ message: "Visitor already converted" });
    }

    // PHOTO CHECK
    const file = req.files?.photo?.[0];

if (!file) {
  return res.status(400).json({ message: "Profile photo is required" });
}

// Convert Windows path to URL friendly
const relativePath = file.path
  .replace(/\\/g, "/")
  .split("backend/")[1];

    if (!admissionAmount) {
      return res.status(400).json({ message: "Admission amount required" });
    }

    // check existing user
    const existingUser = await User.findOne({ email: visitor.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // generate password
    const rawPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // create user
    const user = await User.create({
      name: visitor.name,
      email: visitor.email,
      password: hashedPassword,
      role: "student",
    });

    // create student
    const student = await Student.create({
      userId: user._id,
      name: visitor.name,
      email: visitor.email,
      mobile: visitor.mobile,
      course: visitor.course._id,
      photo: relativePath,
    });

    

    // 💰 CREATE FEE RECORD
    const totalCourseFees = visitor.course.fees || 0;
    const paid = Number(admissionAmount);

    await Fee.create({
      student: student._id,
      course: visitor.course._id,
      totalFees: totalCourseFees,
      totalPaid: paid,
      pendingAmount: totalCourseFees - paid,
      installments: [
        {
          amount: paid,
          paymentMode,
          paymentDate: new Date(),
        },
      ],
    });

    // update visitor
    visitor.status = "Converted";
    await visitor.save();

    // send email
    await sendConfirmationEmail({
      to: visitor.email,
      name: visitor.name,
      email: visitor.email,
      password: rawPassword,
    });

    res.json({
      message: "Visitor converted & fee created successfully",
    });

  } catch (err) {
    console.error("CONVERT VISITOR ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= MOVE TO TRASH =================
exports.deleteVisitor = async (req, res) => {
  try {
    await Visitor.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });
    res.json({ message: "Moved to trash" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= RESTORE VISITOR =================
exports.restoreVisitor = async (req, res) => {
  try {
    await Visitor.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
      status: "Active",
    });
    res.json({ message: "Restored" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
