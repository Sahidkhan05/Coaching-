const Skill = require("../models/Skill");

// ================= ADD SKILL =================
exports.addSkill = async (req, res) => {
  try {
    const { name, category, status } = req.body;

    const skill = await Skill.create({
      name,
      category,
      status,
    });

    res.status(201).json(skill);
  } catch (err) {
    // duplicate skill name
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Skill already exists",
      });
    }
    res.status(500).json({ message: err.message });
  }
};

// ================= GET SKILLS (PAGINATION + FILTER + SORT) =================
exports.getSkills = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const query = { isDeleted: false };

    // 🔍 search by skill name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 📂 filter by category
    if (category) {
      query.category = category;
    }

    // 🟢 filter by status
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const data = await Skill.find(query)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Skill.countDocuments(query);

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

// ================= UPDATE SKILL =================
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE SKILL (SOFT DELETE) =================
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
