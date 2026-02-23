import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";
import { Image } from "lucide-react";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../api/studentApi";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    course: "",
    status: "",
    sort: "createdAt",
    order: "desc",
  });

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    course: "",
    admissionDate: "",
    status: "Active",
  });

  // ================= FETCH STUDENTS =================
  const fetchStudents = async () => {
    const res = await getStudents({
      page,
      limit: 5,
      ...filters,
    });

    setStudents(res.data.data);
    setTotalPages(res.data.totalPages);
  };

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
    fetchStudents();
  }, [page, filters]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= FORM =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleViewImage = (photoPath) => {
  if (!photoPath) {
    alert("No image available");
    return;
  }

  setSelectedImage(`http://localhost:5000/${photoPath}`);
};
  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      course: "",
      admissionDate: "",
      status: "Active",
    });
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateStudent(editId, formData);
    } else {
      await addStudent(formData);
    }

    resetForm();
    fetchStudents();
  };

  const handleEdit = (s) => {
    setFormData({
      name: s.name,
      mobile: s.mobile,
      email: s.email || "",
      course: s.course?._id || "",
      admissionDate: s.admissionDate?.slice(0, 10),
      status: s.status,
    });
    setEditId(s._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteStudent(id);
    fetchStudents();
  };

  // ================= UI =================
  return (
    <div>
      
    
  

    {/* ===== HEADER ===== */}
    <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
      <div>
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-sm opacity-90">
          Manage all students, admissions and records
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-white text-blue-700 px-5 py-2 rounded-xl font-medium shadow hover:scale-105 transition"
      >
        + Add Student
      </button>
    </div>

    {/* ===== FILTER BAR ===== */}
    <div className="bg-white p-5 rounded-2xl shadow flex flex-wrap gap-4 items-center">

      <input
        placeholder="Search students..."
        className="border rounded-xl px-4 py-2 w-60 focus:ring-2 focus:ring-blue-400 outline-none"
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

      <select
        className="border rounded-xl px-4 py-2"
        onChange={(e) =>
          setFilters({ ...filters, course: e.target.value })
        }
      >
        <option value="">All Courses</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

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
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Mobile</th>
            <th className="p-4 text-left">Course</th>
            <th className="p-4 text-left">Admission Date</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-6 text-center text-gray-400">
                No students found
              </td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 font-medium flex items-center gap-3">
  <button
 onClick={() => handleViewImage(s.photo)}
  className="p-2 rounded-full hover:bg-gray-100 transition"
  title="View Image"
>
  <Image size={18} className="text-blue-600" />
</button>
  <span>{s.name}</span>
</td>
                <td className="p-4">{s.email}</td>
                <td className="p-4">{s.mobile}</td>
                <td className="p-4">{s.course?.name}</td>
                <td className="p-4">
                  {new Date(s.admissionDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      s.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
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


      {/* Pagination */}
      <div className="flex justify-end items-center gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn">
      <h2 className="text-xl font-bold mb-4">
        {editId ? "Edit Student" : "Add Student"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-2"
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2"
        />

        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
          className="w-full border rounded-xl px-4 py-2"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="admissionDate"
          value={formData.admissionDate}
          onChange={handleChange}
          required
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
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>

  
)}

{selectedImage && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl relative">

      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
      >
        ✕
      </button>

      <img
        src={selectedImage}
        alt="Student"
        className="w-72 h-72 object-cover rounded-xl"
      />
    </div>
  </div>
)}

    </div>
  );
};

export default Students;
