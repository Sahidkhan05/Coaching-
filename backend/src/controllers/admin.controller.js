const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.createUserByAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role, // student / tutor / hr
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error("CREATE USER ERROR 👉", error);
    res.status(500).json({ message: "Server Error" });
  }
};
