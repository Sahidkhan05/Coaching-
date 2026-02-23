const Student = require("../models/Student");

// ================= ADD STUDENT =================
exports.addStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET STUDENTS (FILTER + SORT + PAGINATION) =================
exports.getStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search,
      course,
      batch,   // 🔥 ADD THIS
      status,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const query = { isDeleted: false };

    // 🔍 Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    

    // Course filter (only if batch not provided)
    if (course && !batch) {
      query.course = course;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const students = await Student.find(query)
      .populate("course", "name skills")
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Student.countDocuments(query);

    res.json({
      data: students,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= UPDATE STUDENT =================
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SOFT DELETE STUDENT =================
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Fee.deleteMany({ student: id });
    await Student.deleteOne({ _id: id });

    res.json({ message: "Student deleted permanently" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};