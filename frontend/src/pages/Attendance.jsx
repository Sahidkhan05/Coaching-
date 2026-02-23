import { useEffect, useState } from "react";
import {
  getCourses,
  getBatchesByCourse,
  getBatchStudents,
  saveAttendance,
  getAttendanceByDate,
  getTimeTablesByBatch,
} from "../api/attendanceApi";

const STATUS_OPTIONS = ["P", "A", "L"];

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [dates, setDates] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [attendanceData, setAttendanceData] = useState({});
  const [lockedDates, setLockedDates] = useState({});

  /* ================= LOCAL DATE FORMAT ================= */
  const formatDateLocal = (date) => {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  /* ================= LOAD BATCHES ================= */
  useEffect(() => {
    if (!selectedCourse) {
      setBatches([]);
      setSelectedBatch("");
      return;
    }
    getBatchesByCourse(selectedCourse).then(setBatches);
  }, [selectedCourse]);

  /* ================= LOAD STUDENTS + TIMETABLE ================= */
  useEffect(() => {
    if (!selectedBatch) {
      setStudents([]);
      setDates([]);
      return;
    }

    getBatchStudents(selectedCourse, selectedBatch).then(setStudents);

    const batchObj = batches.find((b) => b._id === selectedBatch);

    if (batchObj?.startDate) {
      getTimeTablesByBatch(selectedBatch).then((data) => {
        const allowedDays = [...new Set(data.map((t) => t.day))];
        generateAttendanceDates(batchObj.startDate, allowedDays);
      });
    }
  }, [selectedBatch]);

  /* ================= LOAD EXISTING ================= */
  const loadExistingAttendance = async (date) => {
  try {
    const data = await getAttendanceByDate(selectedBatch, date);

    setAttendanceData((prev) => {
      const updated = { ...prev };

      data.students.forEach((s) => {
        const studentId = s.student._id;

        if (!updated[studentId]) {
          updated[studentId] = {};
        }

        updated[studentId][date] = s.status;
      });

      return updated;
    });

    setLockedDates((prev) => ({
      ...prev,
      [date]: true,
    }));
  } catch {
    // ignore
  }
};
  /* ================= GENERATE DATES ================= */
  const generateAttendanceDates = (startDate, allowedDays) => {
    const today = new Date();
    const start = new Date(startDate);

    const arr = [];

    while (start <= today) {
      const dayName = start.toLocaleString("en-US", {
        weekday: "short",
      });

      if (allowedDays.includes(dayName)) {
        arr.push(formatDateLocal(start));
      }

      start.setDate(start.getDate() + 1);
    }

    setDates(arr);
    setAttendanceData({});
    setLockedDates({});

    arr.forEach((date) => {
      loadExistingAttendance(date);
    });
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (studentId, date, value) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: value,
      },
    }));
  };

  /* ================= SAVE ================= */
  const handleSave = async (date) => {
    const formatted = students
      .map((student) => ({
        student: student._id,
        status: attendanceData[student._id]?.[date],
      }))
      .filter((s) => s.status);

    if (!formatted.length) {
      alert("Please mark attendance first");
      return;
    }

    await saveAttendance({
      course: selectedCourse,
      batch: selectedBatch,
      date,
      students: formatted,
    });

    setLockedDates((prev) => ({
      ...prev,
      [date]: true,
    }));

    alert("Attendance saved successfully");
  };

  /* ================= EDIT ================= */
  const handleEdit = (date) => {
    setLockedDates((prev) => ({
      ...prev,
      [date]: false,
    }));
  };

  /* ================= TOTAL ================= */
  const getTotalsByDate = (date) => {
    let totalP = 0;
    let totalA = 0;
    let totalL = 0;

    students.forEach((student) => {
      const status = attendanceData[student._id]?.[date];
      if (status === "P") totalP++;
      if (status === "A") totalA++;
      if (status === "L") totalL++;
    });

    return { totalP, totalA, totalL };
  };

  
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold">Attendance Management</h2>
      </div>

      {/* DROPDOWNS */}
      <div className="bg-white shadow rounded-2xl p-5 flex gap-4">
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setSelectedBatch("");
          }}
          className="border rounded-xl px-4 py-2"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          disabled={!selectedCourse}
          className="border rounded-xl px-4 py-2"
        >
          <option value="">Select Batch</option>
          {batches.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      {selectedBatch && (
        <div className="bg-white rounded-2xl shadow overflow-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Student</th>
                {dates.map((date) => (
                  <th key={date} className="border p-3 text-center">
                    {date}
                  </th>
                ))}
              </tr>

              {/* SAVE / EDIT ROW */}
              <tr>
                <th className="border p-2 text-left">Action</th>
                {dates.map((date) => (
                  <th key={date} className="border p-2 text-center">
                    {!lockedDates[date] ? (
                      <button
                        onClick={() => handleSave(date)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(date)}
                        className="bg-gray-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="border p-3 font-medium">{student.name}</td>
                  {dates.map((date) => (
                    <td key={date} className="border p-2 text-center">
                      <select
                        disabled={lockedDates[date]}
                        value={attendanceData[student._id]?.[date] || ""}
                        onChange={(e) =>
                          handleChange(student._id, date, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="">--</option>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}

              {/* TOTAL ROW */}
              <tr className="bg-gray-100 font-semibold">
                <td className="border p-3">Total</td>
                {dates.map((date) => {
                  const { totalP, totalA, totalL } = getTotalsByDate(date);
                  return (
                    <td key={date} className="border p-2 text-center text-xs">
                      <div className="text-green-600">P: {totalP}</div>
                      <div className="text-red-600">A: {totalA}</div>
                      <div className="text-yellow-600">L: {totalL}</div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;