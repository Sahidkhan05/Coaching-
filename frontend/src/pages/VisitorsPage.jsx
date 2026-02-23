import { useEffect, useState } from "react";
import {
  getVisitors,
  addVisitor,
  updateVisitor,
  deleteVisitor,
  restoreVisitor,
  convertVisitorToStudent,
} from "../api/visitorApi";
import { getCourses } from "../api/courseApi";

const STATUS_TABS = [
  "Active",
  "Follow-up",
  "Converted",
  "Not Interested",
  "Trash",
];

const SOURCES = ["Walk-in", "Call", "Referral", "Online"];

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [courses, setCourses] = useState([]);

  // filters
  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // modal
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [convertId, setConvertId] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [admissionAmount, setAdmissionAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    source: "Walk-in",
    visitDate: "",
    status: "Active",
  });

  // ================= FETCH =================
  const fetchVisitors = async () => {
    const params = {
      page,
      limit: 10,
      search,
      sort,
      order,
    };

    if (status === "Trash") {
      params.trash = true;
    } else {
      params.status = status;
    }

    const res = await getVisitors(params);
    setVisitors(res.data.data);
    setTotalPages(res.data.totalPages);
  };

 const fetchCourses = async () => {
  try {
    const res = await getCourses();
    const courseData = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
    setCourses(courseData);
  } catch (err) {
    console.error("Course fetch error:", err);
    setCourses([]);
  }
};


  useEffect(() => {
    fetchVisitors();
  }, [status, search, page, sort, order]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= ACTIONS =================
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      course: "",
      source: "Walk-in",
      visitDate: "",
      status: "Active",
    });
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateVisitor(editId, formData);
    } else {
      await addVisitor(formData);
    }

    resetForm();
    fetchVisitors();
  };

  const handleEdit = (v) => {
    setFormData({
      name: v.name,
      email: v.email,
      mobile: v.mobile,
      course: v.course?._id || "",
      source: v.source,
      visitDate: v.visitDate?.slice(0, 10),
      status: v.status,
    });
    setEditId(v._id);
    setShowModal(true);
  };

  const handleTrash = async (id) => {
    await deleteVisitor(id);
    fetchVisitors();
  };

  const handleRestore = async (id) => {
    await restoreVisitor(id);
    fetchVisitors();
  };

  //  REAL CONVERT HANDLER
  
  // ================= UI =================
  return (
    <div className="p-6 space-y-6" >
    
    {/* ===== HEADER ===== */}
    <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
      <div>
        <h1 className="text-2xl font-bold">Student Visitors</h1>
        <p className="text-sm opacity-90">
          Manage inquiries and convert leads to students
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-white text-blue-700 px-5 py-2 rounded-xl font-medium shadow hover:scale-105 transition"
      >
        + Add Visitor
      </button>
    </div>

    {/* ===== STATUS TABS ===== */}
    <div className="flex gap-4 border-b">
      {STATUS_TABS.map((s) => (
        <button
          key={s}
          onClick={() => {
            setStatus(s);
            setPage(1);
          }}
          className={`pb-2 text-sm transition ${
            status === s
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          {s}
        </button>
      ))}
    </div>

    {/* ===== FILTER BAR ===== */}
    <div className="bg-white shadow rounded-2xl p-5 flex flex-wrap gap-4 items-center">
      <input
        placeholder="Search name / email / mobile"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border rounded-xl px-4 py-2 w-64 focus:ring-2 focus:ring-blue-400 outline-none"
      />

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

    {/* ===== TABLE ===== */}
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Mobile</th>
            <th className="p-4 text-left">Source</th>
            <th className="p-4 text-left">Course</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {visitors.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-6 text-center text-gray-400">
                No data found
              </td>
            </tr>
          ) : (
            visitors.map((v) => (
              <tr
                key={v._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{v.name}</td>
                <td className="p-4">{v.email}</td>
                <td className="p-4">{v.mobile}</td>
                <td className="p-4">{v.source}</td>
                <td className="p-4">{v.course?.name || "-"}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      v.status === "Converted"
                        ? "bg-green-100 text-green-700"
                        : v.status === "Follow-up"
                        ? "bg-yellow-100 text-yellow-700"
                        : v.status === "Not Interested"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {v.status}
                  </span>
                </td>

                <td className="p-4 flex gap-3 flex-wrap">
                  {!v.isDeleted ? (
                    <>
                      {v.status !== "Converted" && (
                        <button
                          onClick={() => setConvertId(v._id)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Convert
                        </button>
                      )}

                      <button
                        onClick={() => handleEdit(v)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleTrash(v._id)}
                        className="text-gray-600 hover:underline text-sm"
                      >
                        Trash
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRestore(v._id)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Restore
                    </button>
                  )}
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
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
        >
          Prev
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>

    {/* ===== MODAL ===== */}
    {showModal && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">

          <h2 className="text-lg font-semibold">
            {editId ? "Edit Visitor" : "Add Visitor"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-2"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-2"
              required
            />

            <input
              placeholder="Mobile"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-2"
              required
            />

            <select
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-2"
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-2"
            >
              {SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <input
              type="date"
              value={formData.visitDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  visitDate: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-2"
            />

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>

          </form>
        </div>
      </div>
    )}

    {convertId && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-5">

      <h2 className="text-xl font-semibold text-gray-800">
        Convert Visitor to Student
      </h2>

      {/* Profile Photo */}
      <div>
        <label className="text-sm font-medium text-gray-600">
          Profile Photo *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedPhoto(e.target.files[0])}
          className="w-full border rounded-xl px-3 py-2 mt-1"
        />
      </div>

      {/* Admission Amount */}
      <div>
        <label className="text-sm font-medium text-gray-600">
          Registration / Admission Amount *
        </label>
        <input
          type="number"
          value={admissionAmount}
          onChange={(e) => setAdmissionAmount(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 mt-1"
        />
      </div>

      {/* Payment Mode */}
      <div>
        <label className="text-sm font-medium text-gray-600">
          Payment Mode
        </label>
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 mt-1"
        >
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Bank">Bank</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => {
            setConvertId(null);
            setSelectedPhoto(null);
            setAdmissionAmount("");
          }}
          className="border px-4 py-2 rounded-xl hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            if (!selectedPhoto || !admissionAmount) {
              alert("All fields are required");
              return;
            }

            const formData = new FormData();
            formData.append("photo", selectedPhoto);
            formData.append("admissionAmount", admissionAmount);
            formData.append("paymentMode", paymentMode);

            try {
              await convertVisitorToStudent(convertId, formData);
              alert("Visitor converted successfully 🎉");

              setConvertId(null);
              setSelectedPhoto(null);
              setAdmissionAmount("");
              fetchVisitors();
            } catch (err) {
              alert(err.response?.data?.message || "Conversion failed");
            }
          }}
          className="bg-green-600 text-white px-5 py-2 rounded-xl hover:scale-105 transition"
        >
          Convert
        </button>
      </div>

    </div>
  </div>
)}

  </div>
);


      
     

      
    
};

export default Visitors;
