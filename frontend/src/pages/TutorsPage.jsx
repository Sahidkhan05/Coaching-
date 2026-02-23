import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";
import {
  getTutors,
  addTutor,
  updateTutor,
  deleteTutor,
} from "../api/tutorApi";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [courses, setCourses] = useState([]);

  // filters + pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // modal
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "tutor",
    courses: [],
    joiningDate: "",
    status: "Active",
  });

  // ================= FETCH =================
  const fetchTutors = async () => {
    const res = await getTutors({
      page,
      limit: 10,
      search,
      status: statusFilter,
      role: roleFilter,
      sort,
      order,
    });

    setTutors(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  const fetchCourses = async () => {
    const res = await getCourses();
    setCourses(res.data.data || []);
  };

  useEffect(() => {
    fetchTutors();
  }, [page, search, statusFilter, roleFilter, sort, order]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCourse = (courseId) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter((id) => id !== courseId)
        : [...prev.courses, courseId],
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      role: "tutor",
      courses: [],
      joiningDate: "",
      status: "Active",
    });
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateTutor(editId, formData);
      } else {
        await addTutor(formData);
      }

      resetForm();
      fetchTutors();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (t) => {
    setFormData({
      name: t.name,
      mobile: t.mobile,
      email: t.email || "",
      role: t.role || "tutor",
      courses: t.courses?.map((c) => c._id) || [],
      joiningDate: t.joiningDate?.slice(0, 10),
      status: t.status,
    });
    setEditId(t._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    await deleteTutor(id);
    fetchTutors();
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-2xl shadow">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-sm opacity-90">
            Manage Tutor, HR and Staff Members
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-indigo-700 px-5 py-2 rounded-xl font-medium shadow hover:scale-105 transition"
        >
          + Add Employee
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl shadow flex flex-wrap gap-4 items-center">
        <input
          placeholder="Search name / email / mobile..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-xl px-4 py-2 w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-xl px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-xl px-4 py-2"
        >
          <option value="">All Roles</option>
          <option value="tutor">Tutor</option>
          <option value="hr">HR</option>
          <option value="other">Other</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="createdAt">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Mobile</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Courses</th>
              <th className="p-4 text-left">Joining Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tutors.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-400">
                  No employees found
                </td>
              </tr>
            ) : (
              tutors.map((t) => (
                <tr key={t._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{t.name}</td>
                  <td className="p-4">{t.email}</td>
                  <td className="p-4">{t.mobile}</td>
                  <td className="p-4 capitalize">{t.role}</td>
                  <td className="p-4">
                    {t.role === "tutor"
                      ? t.courses?.map((c) => c.name).join(", ")
                      : "-"}
                  </td>
                  <td className="p-4">
                    {t.joiningDate
                      ? new Date(t.joiningDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4">{t.status}</td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-600 hover:underline"
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

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Employee" : "Add Employee"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full border rounded-xl px-4 py-2" />
              <input name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} required className="w-full border rounded-xl px-4 py-2" />
              <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border rounded-xl px-4 py-2" />

              <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded-xl px-4 py-2">
                <option value="tutor">Tutor</option>
                <option value="hr">HR</option>
                <option value="other">Other</option>
              </select>

              {formData.role === "tutor" && (
                <div>
                  <p className="font-medium mb-2">Assign Courses</p>
                  <div className="grid grid-cols-2 gap-2">
                    {courses.map((c) => (
                      <label key={c._id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.courses.includes(c._id)}
                          onChange={() => toggleCourse(c._id)}
                        />
                        {c.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full border rounded-xl px-4 py-2" />

              <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-xl px-4 py-2">
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border">
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white">
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

export default Tutors;