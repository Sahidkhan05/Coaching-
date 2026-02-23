import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";
import { getBatches } from "../api/batchApi";
import { getTutorsByCourse } from "../api/tutorApi";
import { getBatchStudents } from "../api/batchMappingApi";
import {
  getTimeTables,
  createTimeTable,
  updateTimeTable,
  deleteTimeTable,
} from "../api/timeTableApi";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TimeTable = () => {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [slots, setSlots] = useState([]);
  const [students, setStudents] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formBatches, setFormBatches] = useState([]);
  const [tutors, setTutors] = useState([]);

  const [form, setForm] = useState({
    course: "",
    batch: "",
    tutor: "",
    daySlots: [],
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    getCourses({ limit: 100 }).then((res) =>
      setCourses(res.data.data || [])
    );
    
  }, []);

  useEffect(() => {
  if (!form.course) {
    setTutors([]);
    return;
  }

  getTutorsByCourse(form.course).then((res) => {
    setTutors(res.data || []);
  });

}, [form.course]);

  /* ================= FILTER ================= */
  useEffect(() => {
    if (!selectedCourse) {
      setBatches([]);
      setSelectedBatch("");
      return;
    }

    getBatches({ course: selectedCourse }).then((res) =>
      setBatches(res.data.data || [])
    );
    setSelectedBatch("");
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedBatch) {
      setSlots([]);
      setStudents([]);
      return;
    }

    getTimeTables({ batch: selectedBatch }).then((res) =>
      setSlots(res.data || [])
    );

    getBatchStudents({
      course: selectedCourse,
      batch: selectedBatch,
    }).then((res) =>
      setStudents(res.data?.data || [])
    );
  }, [selectedBatch, selectedCourse]);

  useEffect(() => {
    if (!form.course) {
      setFormBatches([]);
      return;
    }

    getBatches({ course: form.course }).then((res) =>
      setFormBatches(res.data.data || [])
    );
  }, [form.course]);

  /* ================= SAVE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.course ||
      !form.batch ||
      !form.tutor ||
      !form.daySlots.length ||
      form.daySlots.some(
        (slot) =>
          !slot.startTime ||
          !slot.endTime ||
          slot.endTime <= slot.startTime
      )
    ) {
      alert("Fill all fields correctly");
      return;
    }

    if (editId) {
      const slot = form.daySlots[0];

      await updateTimeTable(editId, {
        course: form.course,
        batch: form.batch,
        tutor: form.tutor,
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    } else {
      await createTimeTable({
        course: form.course,
        batch: form.batch,
        tutor: form.tutor,
        slots: form.daySlots,
      });
    }

    if (selectedBatch === form.batch) {
      const res = await getTimeTables({ batch: selectedBatch });
      setSlots(res.data || []);
    }

    setOpenModal(false);
    setEditId(null);
    setForm({
      course: "",
      batch: "",
      tutor: "",
      daySlots: [],
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this timetable?")) return;
    await deleteTimeTable(id);
    setSlots((prev) => prev.filter((s) => s._id !== id));
  };

  const daySlots = DAYS.reduce((acc, day) => {
    acc[day] = slots.filter((s) => s.day === day);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
        <div>
          <h1 className="text-2xl font-bold">Time Table</h1>
          <p className="text-sm opacity-90">
            Manage weekly class schedules
          </p>
        </div>

        <button
          onClick={() => {
            setEditId(null);
            setOpenModal(true);
          }}
          className="bg-white text-blue-700 px-5 py-2 rounded-xl font-medium shadow"
        >
          + Create Timetable
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white shadow rounded-2xl p-5 grid md:grid-cols-2 gap-4">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
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
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* TIMETABLE GRID */}
      {selectedBatch && (
        <div className="grid md:grid-cols-7 gap-4">
          {DAYS.map((day) => (
            <div key={day} className="bg-white shadow rounded-2xl p-3">
              <h3 className="text-center font-semibold mb-3">
                {day}
              </h3>

              {daySlots[day]?.map((slot) => (
  <div
    key={slot._id}
    className="bg-blue-50 rounded-xl p-3 mb-3 shadow-sm"
  >
    <p className="text-sm font-semibold">
      {slot.startTime} - {slot.endTime}
    </p>

    <p className="text-xs font-medium mt-1">
      👨‍🏫 {slot.tutor?.name || "Tutor"}
    </p>

    <p className="text-xs text-gray-500">
      👥 {students.length} Students
    </p>

    <div className="mt-2">
      <button
        onClick={() => {
          setEditId(slot._id);
          setForm({
            course: slot.course?._id,
            batch: slot.batch?._id,
            tutor: slot.tutor?._id,
            daySlots: [
              {
                day: slot.day,
                startTime: slot.startTime,
                endTime: slot.endTime,
              },
            ],
          });
          setOpenModal(true);
        }}
        className="text-blue-600 text-xs mr-2"
      >
        Edit
      </button>

      <button
        onClick={() => handleDelete(slot._id)}
        className="text-red-600 text-xs"
      >
        Delete
      </button>
    </div>
  </div>
))}
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white w-[500px] rounded-2xl p-6 space-y-4">

            <h2 className="font-semibold text-lg">
              {editId ? "Edit Timetable" : "Create Timetable"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <select
                value={form.course}
                onChange={(e) =>
                  setForm({ ...form, course: e.target.value })
                }
                className="border p-2 rounded-lg w-full"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={form.batch}
                onChange={(e) =>
                  setForm({ ...form, batch: e.target.value })
                }
                className="border p-2 rounded-lg w-full"
              >
                <option value="">Select Batch</option>
                {formBatches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <select
                value={form.tutor}
                onChange={(e) =>
                  setForm({ ...form, tutor: e.target.value })
                }
                className="border p-2 rounded-lg w-full"
              >
                <option value="">Select Tutor</option>
                {tutors.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>

              {/* DAYS WITH TIME */}
              <div className="space-y-2 max-h-72 overflow-y-auto">
  {DAYS.map((day) => {
    const slot = form.daySlots.find((d) => d.day === day);

    return (
      <div
        key={day}
        className="border rounded-xl px-4 py-3 bg-gray-50"
      >
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={!!slot}
              onChange={() => {
                const exists = form.daySlots.find(
                  (d) => d.day === day
                );

                if (exists) {
                  setForm({
                    ...form,
                    daySlots: form.daySlots.filter(
                      (d) => d.day !== day
                    ),
                  });
                } else {
                  setForm({
                    ...form,
                    daySlots: [
                      ...form.daySlots,
                      { day, startTime: "", endTime: "" },
                    ],
                  });
                }
              }}
            />
            <span className="font-medium text-sm">
              {day}
            </span>
          </div>

          {slot && (
            <div className="flex gap-2">
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    daySlots: form.daySlots.map((d) =>
                      d.day === day
                        ? { ...d, startTime: e.target.value }
                        : d
                    ),
                  })
                }
                className="border px-2 py-1 rounded-lg text-sm"
              />

              <input
                type="time"
                value={slot.endTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    daySlots: form.daySlots.map((d) =>
                      d.day === day
                        ? { ...d, endTime: e.target.value }
                        : d
                    ),
                  })
                }
                className="border px-2 py-1 rounded-lg text-sm"
              />
            </div>
          )}
        </div>
      </div>
    );
  })}
</div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
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

export default TimeTable;