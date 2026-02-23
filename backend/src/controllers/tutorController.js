const Tutor = require("../models/Tutor"); // later rename to Employee if needed
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const sendConfirmationEmail = require("../utils/sendEmail");

//  random password generator
const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

// ================= ADD EMPLOYEE =================
exports.addTutor = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      role,
      courses = [],
      joiningDate,
      status = "Active",
    } = req.body;

    // ================= BASIC VALIDATION =================
    if (!name || !mobile || !email || !role) {
      return res.status(400).json({
        message: "Name, Mobile, Email and Role are required",
      });
    }

    // ================= ROLE VALIDATION =================
    if (!["tutor", "hr", "other"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role selected",
      });
    }

    // ================= TUTOR SPECIFIC VALIDATION =================
    if (role === "tutor" && (!courses || courses.length === 0)) {
      return res.status(400).json({
        message: "Courses are required for tutor",
      });
    }

    // ================= DUPLICATE CHECK =================
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const existingEmployee = await Tutor.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee already exists with this email",
      });
    }

    // ================= PASSWORD GENERATION =================
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // ================= CREATE USER =================
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role, // dynamic role
    });

    // ================= CREATE EMPLOYEE =================
    const employee = await Tutor.create({
      userId: user._id,
      name,
      email,
      mobile,
      role,
      courses: role === "tutor" ? courses : [],
      joiningDate,
      status,
    });

    // ================= SEND EMAIL (SAFE BLOCK) =================
    try {
      await sendConfirmationEmail({
        to: email,
        name,
        role: role.toUpperCase(),
        password: plainPassword,
      });
    } catch (emailError) {
      console.error(
        "Email failed but employee created:",
        emailError.message
      );
    }

    return res.status(201).json({
      message: "Employee created successfully",
      employee,
    });

  } catch (err) {
    console.error("ADD EMPLOYEE ERROR:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ================= GET EMPLOYEES (FILTER + SORT + PAGINATION) =================
exports.getTutors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      role,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const query = { isDeleted: false };

    // 🔍 Search by name/email/mobile
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    // 🟢 Filter by status
    if (status) {
      query.status = status;
    }

    // 👤 Filter by role
    if (role) {
      query.role = role;
    }

    const skip = (page - 1) * Number(limit);

    const data = await Tutor.find(query)
      .populate("courses", "name skills")
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Tutor.countDocuments(query);

    res.json({
      data,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    console.error("GET EMPLOYEES ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE EMPLOYEE =================
exports.updateTutor = async (req, res) => {
  try {
    const employee = await Tutor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json(employee);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SOFT DELETE EMPLOYEE =================
exports.deleteTutor = async (req, res) => {
  try {
    const employee = await Tutor.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json({ message: "Employee moved to trash" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET TUTORS BY COURSE =================
exports.getTutorsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required",
      });
    }

    const tutors = await Tutor.find({
      role: "tutor",
      courses: courseId,
      status: "Active",
      isDeleted: false,
    })
      .select("name courses")
      .populate("courses", "name");

    res.json(tutors);

  } catch (err) {
    console.error("GET TUTORS BY COURSE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};