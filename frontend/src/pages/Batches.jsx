import { useEffect, useState } from "react";
import {
  getBatches,
  addBatch,
  updateBatch,
  deleteBatch,
} from "../api/batchApi";

const Batches = () => {
  const [batches, setBatches] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sort: "createdAt",
    order: "desc",
  });

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  /* ================= FETCH ================= */
  const fetchBatches = async () => {
    const res = await getBatches({
      page,
      limit: 5,
      ...filters,
    });

    setBatches(res.data.data || []);
    setTotalPages(res.data.totalPages || 1);
  };

  useEffect(() => {
    fetchBatches();
  }, [page, filters]);

  /* ================= FORM ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateBatch(editId, formData);
      } else {
        await addBatch(formData);
      }

      resetForm();
      setPage(1);
      fetchBatches();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleEdit = (b) => {
    setFormData({
      name: b.name || "",
      category: b.category || "",
      startDate: b.startDate ? b.startDate.slice(0, 10) : "",
      endDate: b.endDate ? b.endDate.slice(0, 10) : "",
      status: b.status || "Active",
    });

    setEditId(b._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this batch?")) return;

    try {
      await deleteBatch(id);
      fetchBatches();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  /* ================= UI ================= */
  return (
    <div>
      {/* HEADER */}
       <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
      <div>
        <h1 className="text-2xl font-bold">Batches</h1>
        <p className="text-sm opacity-90">
          Manage batch schedules and categories
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-white text-purple-700 px-5 py-2 rounded-xl font-medium shadow hover:scale-105 transition"
      >
        + Add Batch
      </button>
    </div>

    {/* ===== FILTER BAR ===== */}
    <div className="bg-white p-5 rounded-2xl shadow flex flex-wrap gap-4 items-center">

      <input
        placeholder="Search batch name..."
        className="border rounded-xl px-4 py-2 w-60 focus:ring-2 focus:ring-purple-400 outline-none"
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

      <select
        className="border rounded-xl px-4 py-2"
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value })
        }
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <select
        className="border rounded-xl px-4 py-2"
        onChange={(e) =>
          setFilters({ ...filters, order: e.target.value })
        }
      >
        <option value="desc">Newest</option>
        <option value="asc">Oldest</option>
      </select>

    </div>

    {/* ===== TABLE ===== */}
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">Batch Name</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Start Date</th>
            <th className="p-4 text-left">End Date</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {batches.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-6 text-center text-gray-400">
                No batches found
              </td>
            </tr>
          ) : (
            batches.map((b) => (
              <tr key={b._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{b.name}</td>
                <td className="p-4">{b.category || "-"}</td>
                <td className="p-4 text-gray-600">{formatDate(b.startDate)}</td>
                <td className="p-4 text-gray-600">{formatDate(b.endDate)}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      b.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(b)}
                    className="text-purple-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* ===== PAGINATION ===== */}
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
        >
          Prev
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>

      {/* MODAL */}
      {showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
      <h2 className="text-xl font-bold mb-4">
        {editId ? "Edit Batch" : "Add Batch"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          placeholder="Batch Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
        />

        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2"
        />

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2"
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Batches;
