const User = require("../models/user.model");
const Student = require("../models/Student");
const Tutor = require("../models/Tutor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //  Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //  Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    /* ================= STUDENT LOGIN ================= */
    if (user.role === "student") {
      const student = await Student.findOne({ email });

      if (!student) {
        return res.status(404).json({ message: "Student record not found" });
      }

      return res.json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          role: user.role,
          studentId: student._id,   
          batchId: student.batch,   
        },
      });
    }

    /* ================= TUTOR LOGIN ================= */
    if (user.role === "tutor") {
      const tutor = await Tutor.findOne({ email });

      return res.json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          role: user.role,
          tutorId: tutor?._id,    
        },
      });
    }

    /* ================= ADMIN / HR ================= */
    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR ", error);
    res.status(500).json({ message: "Server Error" });
  }
};
