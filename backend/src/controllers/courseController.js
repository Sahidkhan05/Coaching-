const Course = require("../models/Course");

// ================= ADD COURSE =================
exports.addCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET COURSES (FILTER + SORT + PAGINATION) =================
exports.getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search,
      status,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const query = { isDeleted: false };

    // 🔍 Search by course name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // ✅ Filter by status
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const courses = await Course.find(query)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);

    res.json({
      data: courses,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET SINGLE COURSE =================
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE COURSE =================
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SOFT DELETE COURSE =================
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Course moved to trash" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
