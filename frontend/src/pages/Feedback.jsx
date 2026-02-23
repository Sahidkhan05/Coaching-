import { useEffect, useState } from "react";
import {
  getCourses,
  getBatchesByCourse,
  getBatchStudents,
} from "../api/attendanceApi";
import {
  saveFeedback,
  getFeedbackByBatch,
} from "../api/feedbackApi";

const Feedback = () => {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [feedbackData, setFeedbackData] = useState({});
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [loadingStudentId, setLoadingStudentId] = useState(null);

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    const fetchCourses = async () => {
      const courseList = await getCourses();
      setCourses(courseList);
    };
    fetchCourses();
  }, []);

  /* ================= LOAD BATCHES ================= */
  useEffect(() => {
    if (!selectedCourse) {
      setBatches([]);
      return;
    }

    const fetchBatches = async () => {
      const batchList = await getBatchesByCourse(selectedCourse);
      setBatches(batchList);
    };

    fetchBatches();
  }, [selectedCourse]);

  /* ================= LOAD STUDENTS + FEEDBACK ================= */
  useEffect(() => {
    if (!selectedCourse || !selectedBatch) return;

    const fetchData = async () => {
      const studentList = await getBatchStudents(
        selectedCourse,
        selectedBatch
      );
      setStudents(studentList);

      const initial = {};
      studentList.forEach((s) => {
        initial[s._id] = {
          rating: "",
          note: "",
          originalRating: "",
          originalNote: "",
          saved: false,
        };
      });

      const feedbackList = await getFeedbackByBatch(selectedBatch);

      feedbackList.forEach((fb) => {
        const id = fb.student?._id || fb.student; // FIXED
        if (initial[id]) {
          initial[id] = {
            rating: fb.rating,
            note: fb.note,
            originalRating: fb.rating,
            originalNote: fb.note,
            saved: true,
          };
        }
      });

      setFeedbackData(initial);
    };

    fetchData();
  }, [selectedCourse, selectedBatch]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (studentId, field, value) => {
    setFeedbackData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  /* ================= SAVE ================= */
  const handleSave = async (studentId) => {
    const data = feedbackData[studentId];

    if (!data.rating || !data.note) {
      alert("Please fill rating and note");
      return;
    }

    try {
      setLoadingStudentId(studentId);

      await saveFeedback({
        course: selectedCourse,
        batch: selectedBatch,
        student: studentId,
        rating: data.rating,
        note: data.note,
      });

      setFeedbackData((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          originalRating: data.rating,
          originalNote: data.note,
          saved: true,
        },
      }));

      setEditingStudentId(null);
    } catch (err) {
      alert("Error saving feedback");
    } finally {
      setLoadingStudentId(null);
    }
  };

  /* ================= CANCEL ================= */
  const handleCancel = (studentId) => {
    const data = feedbackData[studentId];

    setFeedbackData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        rating: data.originalRating,
        note: data.originalNote,
      },
    }));

    setEditingStudentId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold">
          Feedback Management
        </h2>
      </div>

      {/* DROPDOWNS */}
      <div className="bg-white shadow rounded-2xl p-5 flex gap-4">
        <select
          className="border rounded-xl px-4 py-2"
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setSelectedBatch("");
            setStudents([]);
          }}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded-xl px-4 py-2"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          disabled={!selectedCourse}
        >
          <option value="">Select Batch</option>
          {batches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* CARDS */}
      {selectedBatch && students.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => {
            const data = feedbackData[student._id] || {};
            const isEditing =
              editingStudentId === student._id;

            return (
              <div
                key={student._id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">
                    {student.name}
                  </h3>

                  {data.saved && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Saved
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="mb-3">
                  <label className="text-sm text-gray-500">
                    Rating
                  </label>

                  {isEditing ? (
                    <div className="flex gap-2 mt-1">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          onClick={() =>
                            handleChange(
                              student._id,
                              "rating",
                              r
                            )
                          }
                          className={`text-2xl ${
                            data.rating >= r
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-yellow-500 text-xl">
                      {"★".repeat(data.rating || 0)}
                    </div>
                  )}
                </div>

                {/* Note */}
                <div className="mb-4">
                  <label className="text-sm text-gray-500">
                    Note
                  </label>

                  {isEditing ? (
                    <textarea
                      className="border rounded-xl p-2 w-full mt-1 text-sm"
                      rows="3"
                      value={data.note || ""}
                      onChange={(e) =>
                        handleChange(
                          student._id,
                          "note",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm text-gray-700 mt-1">
                      {data.note || "No feedback yet"}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() =>
                          handleSave(student._id)
                        }
                        disabled={
                          loadingStudentId ===
                          student._id
                        }
                        className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm"
                      >
                        Save
                      </button>

                      <button
                        onClick={() =>
                          handleCancel(student._id)
                        }
                        className="flex-1 bg-gray-500 text-white py-2 rounded-xl text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        setEditingStudentId(
                          student._id
                        )
                      }
                      className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm"
                    >
                      {data.saved
                        ? "Edit Feedback"
                        : "Add Feedback"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Feedback;