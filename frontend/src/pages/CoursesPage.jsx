import { useEffect, useState } from "react";
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../api/courseApi";

const Courses = () => {
  const [courses, setCourses] = useState([]);

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
    duration: "",
    fees: "",
    status: "Active",
  });

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    const res = await getCourses({
      page,
      limit: 5,
      ...filters,
    });

    setCourses(res.data.data || []);
    setTotalPages(res.data.totalPages || 1);
  };

  useEffect(() => {
    fetchCourses();
  }, [page, filters]);

  // ================= FORM =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      duration: "",
      fees: "",
      status: "Active",
    });
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateCourse(editId, formData);
    } else {
      await addCourse(formData);
    }

    resetForm();
    fetchCourses();
  };

  const handleEdit = (course) => {
    setFormData({
      name: course.name,
      duration: course.duration || "",
      fees: course.fees || "",
      status: course.status,
    });
    setEditId(course._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    await deleteCourse(id);
    fetchCourses();
  };

  // ================= UI =================
  return (
    <div>
      

    {/* ===== HEADER ===== */}
    <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
      <div>
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-sm opacity-90">
          Manage courses, duration and fee structure
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-white text-blue-700 px-5 py-2 rounded-xl font-medium shadow hover:scale-105 transition"
      >
        + Add Course
      </button>
    </div>

    {/* ===== FILTER BAR ===== */}
    <div className="bg-white p-5 rounded-2xl shadow flex flex-wrap gap-4 items-center">

      <input
        placeholder="Search course name..."
        className="border rounded-xl px-4 py-2 w-60 focus:ring-2 focus:ring-blue-400 outline-none"
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
            <th className="p-4 text-left">Course Name</th>
            <th className="p-4 text-left">Duration</th>
            <th className="p-4 text-left">Fees</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-6 text-center text-gray-400">
                No courses found
              </td>
            </tr>
          ) : (
            courses.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4">{c.duration || "-"}</td>
                <td className="p-4 font-semibold text-blue-600">
                  ₹{c.fees || "-"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
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
        {editId ? "Edit Course" : "Add Course"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          placeholder="Course Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          name="duration"
          placeholder="Duration (e.g. 6 Months)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2"
        />

        <input
          name="fees"
          placeholder="Fees"
          value={formData.fees}
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
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
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

export default Courses;
