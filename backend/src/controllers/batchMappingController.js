const BatchMapping = require("../models/BatchMapping");

// ================= ADD =================
exports.addBatchMapping = async (req, res) => {
  try {
    const { course, batch, tutor, students } = req.body;

    if (!course || !batch || !tutor) {
      return res.status(400).json({ message: "Course, Batch and Tutor are required" });
    }

    const mapping = await BatchMapping.create({
      course,
      batch,
      tutor,
      students: students || [],  // default empty array
    });

    res.status(201).json(mapping);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "This batch is already mapped to the course" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ================= GET STUDENTS BY BATCH (FOR TIMETABLE) =================
exports.getBatchStudents = async (req, res) => {
  try {
    const { course, batch } = req.query;

    if (!course || !batch) {
      return res.status(400).json({
        message: "Course and batch required",
      });
    }

    const mapping = await BatchMapping.findOne({
      course,
      batch,
    }).populate("students", "name mobile");

    if (!mapping) {
      return res.json({ data: [] });
    }

    res.json({ data: mapping.students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= GET (FILTER + SORT + PAGINATION) =================
exports.getBatchMappings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      course,
      batch,
      tutor,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    if (course) query.course = course;
    if (batch) query.batch = batch;
    if (tutor) query.tutor = tutor;

    const skip = (page - 1) * Number(limit);

    const mappings = await BatchMapping.find(query)
      .populate("course", "name")
      .populate("batch", "name")
      .populate("tutor", "name")
      .populate("students", "name mobile")
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await BatchMapping.countDocuments(query);

    res.json({
      data: mappings,
      page: Number(page),
      total,
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    console.error("GET BATCH MAPPINGS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// ================= UPDATE =================
exports.updateBatchMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const { course, batch, tutor, students } = req.body;

    if (!course || !batch || !tutor || !students?.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await BatchMapping.findByIdAndUpdate(
      id,
      { course, batch, tutor, students },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Batch mapping not found" });
    }

    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "This batch is already mapped to the course" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
exports.deleteBatchMapping = async (req, res) => {
  try {
    const deleted = await BatchMapping.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Batch mapping not found" });
    }

    res.json({ message: "Batch mapping deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
