import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";
import { getBatches } from "../api/batchApi";
import { getTutorsByCourse } from "../api/tutorApi";
import { getStudents } from "../api/studentApi";
import {
  addBatchMapping,
  getBatchMappings,
  updateBatchMapping,
  deleteBatchMapping,
} from "../api/batchMappingApi";

const BatchMapping = () => {
  // dropdown data
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);

  // selections
  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [tutorId, setTutorId] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // list
  const [mappings, setMappings] = useState([]);

  // pagination + sort
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [order, setOrder] = useState("desc");

  // edit
  const [editId, setEditId] = useState(null);

  // 🔥 view students modal
  const [showModal, setShowModal] = useState(false);
  const [viewStudents, setViewStudents] = useState([]);
  const [viewTitle, setViewTitle] = useState("");

  /* ================= FETCH BASE DATA ================= */
  useEffect(() => {
    getCourses({ limit: 100 }).then((res) =>
      setCourses(res.data.data || [])
    );
   
    fetchMappings(1);
  }, []);

  /* ================= COURSE → BATCH + STUDENTS ================= */
  useEffect(() => {
    if (courseId) {
      getBatches({ course: courseId, limit: 100 }).then((res) =>
        setBatches(res.data.data || [])
      );

      getStudents({ course: courseId, limit: 200 }).then((res) =>
        setStudents(res.data.data || [])
      );

      getTutorsByCourse(courseId).then((res) =>
      setTutors(res.data || [])
    );


      if (!editId) {
    setBatchId("");
    setTutorId("");
    setSelectedStudents([]);
  }
    }
  }, [courseId]);

  /* ================= FETCH MAPPINGS ================= */
  const fetchMappings = async (p = page) => {
    const res = await getBatchMappings({
      page: p,
      limit: 5,
      order,
    });

    setMappings(res.data.data || []);
    setTotalPages(res.data.totalPages || 1);
  };



  /* ================= STUDENT MULTI SELECT ================= */
  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  /* ================= SAVE / UPDATE ================= */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!courseId || !batchId || !tutorId) {
    alert("Course, Batch and Tutor are required");
    return;
  }

  const payload = {
    course: courseId,
    batch: batchId,
    tutor: tutorId,
    students: selectedStudents || [], // default empty
  };

  try {
    if (editId) {
      await updateBatchMapping(editId, payload);
      alert("Batch mapping updated");
    } else {
      await addBatchMapping(payload);
      alert("Batch mapped successfully");
    }

    // Reset form
    setCourseId("");
    setBatchId("");
    setTutorId("");
    setSelectedStudents([]);
    setEditId(null);

    fetchMappings(1);
  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  }
};


  /* ================= EDIT ================= */
  const handleEdit = (m) => {
    setCourseId(m.course?._id);
    setBatchId(m.batch?._id);
    setTutorId(m.tutor?._id);
    setSelectedStudents(m.students.map((s) => s._id));
    setEditId(m._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this mapping?")) return;
    await deleteBatchMapping(id);
    fetchMappings(page);
  };

  /* ================= VIEW STUDENTS ================= */
  const handleViewStudents = (m) => {
    setViewStudents(m.students || []);
    setViewTitle(
      `${m.course?.name} | ${m.batch?.name} | ${m.tutor?.name}`
    );
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
      <div>
        <h1 className="text-2xl font-bold">Batch Mapping</h1>
        <p className="text-sm opacity-90">
          Assign tutors and students to batches
        </p>
      </div>

      <select
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        className="bg-white text-indigo-700 px-4 py-2 rounded-xl"
      >
        <option value="desc">Newest</option>
        <option value="asc">Oldest</option>
      </select>
    </div>

    {/* ================= FORM ================= */}
    <div className="bg-white rounded-2xl shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            disabled={!courseId}
            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none disabled:bg-gray-100"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={tutorId}
            onChange={(e) => setTutorId(e.target.value)}
            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="">Select Tutor</option>
            {tutors.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* STUDENTS */}
        {students.length > 0 && (
          <div>
            <p className="font-semibold mb-3 text-gray-700">
              Select Students ({selectedStudents.length})
            </p>

            <div className="grid md:grid-cols-3 gap-3 max-h-52 overflow-y-auto border rounded-xl p-4 bg-gray-50">
              {students.map((s) => (
                <label
                  key={s._id}
                  className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm hover:bg-indigo-50 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s._id)}
                    onChange={() => toggleStudent(s._id)}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="text-right">
          <button className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
            {editId ? "Update Mapping" : "Save Mapping"}
          </button>
        </div>

      </form>
    </div>

    {/* ================= TABLE ================= */}
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">Course</th>
            <th className="p-4 text-left">Batch</th>
            <th className="p-4 text-left">Tutor</th>
            <th className="p-4 text-center">Students</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {mappings.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-6 text-center text-gray-400">
                No mappings found
              </td>
            </tr>
          ) : (
            mappings.map((m) => (
              <tr key={m._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{m.course?.name}</td>
                <td className="p-4">{m.batch?.name}</td>
                <td className="p-4">{m.tutor?.name}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleViewStudents(m)}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    {m.students?.length} View
                  </button>
                </td>
                <td className="p-4 text-center space-x-4">
                  <button
                    onClick={() => handleEdit(m)}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m._id)}
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

      {/* ================= MODAL ================= */}
      {showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white w-[500px] rounded-2xl shadow-2xl p-6">
      <h2 className="text-xl font-semibold mb-1">Students List</h2>
      <p className="text-sm text-gray-500 mb-4">{viewTitle}</p>

      {viewStudents.length === 0 ? (
        <p className="text-gray-400">No students found</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {viewStudents.map((s) => (
            <li
              key={s._id}
              className="border rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
            >
              {s.name} ({s.mobile})
            </li>
          ))}
        </ul>
      )}

      <div className="text-right mt-5">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default BatchMapping;
