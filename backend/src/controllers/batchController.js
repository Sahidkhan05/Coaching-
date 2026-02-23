const Batch = require("../models/Batch");

// ================= ADD BATCH =================
exports.addBatch = async (req, res) => {
  try {
    const { name, category, startDate, endDate, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Batch name is required" });
    }

    const batchData = {
      name,
      category,
      status,
    };

    if (startDate) {
      batchData.startDate = new Date(startDate);
    }

    if (endDate) {
      batchData.endDate = new Date(endDate);
    }

    const batch = await Batch.create(batchData);

    res.status(201).json(batch);
  } catch (err) {
    console.error("Add Batch Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================= GET BATCHES (FILTER + SORT + PAGINATION) =================
exports.getBatches = async (req, res) => {
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

    // 🔍 search by batch name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // ✅ filter by status
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const batches = await Batch.find(query)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Batch.countDocuments(query);

    res.json({
      data: batches,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE BATCH =================
exports.updateBatch = async (req, res) => {
  try {
    const { name, category, startDate, endDate, status } = req.body;

    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SOFT DELETE BATCH =================
exports.deleteBatch = async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);

    res.json({ message: "Batch permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
