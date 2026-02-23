import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";
import { getBatches } from "../api/batchApi";
import { getBatchStudents } from "../api/batchMappingApi";
import {
  addFee,
  addInstallment,
} from "../api/feeApi";
import API from "../api/axios";

const PAYMENT_MODES = ["Cash", "UPI", "Bank"];

const Fees = () => {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [studentId, setStudentId] = useState("");

  const [fee, setFee] = useState(null);
  const [totalFees, setTotalFees] = useState("");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");

  /* ================= FETCH DROPDOWNS ================= */

  useEffect(() => {
    getCourses({ limit: 100 }).then(res =>
      setCourses(res.data.data || [])
    );
  }, []);

  useEffect(() => {
    if (courseId) {
      getBatches({ course: courseId }).then(res =>
        setBatches(res.data.data || [])
      );
      setBatchId("");
      setStudentId("");
      setStudents([]);
      setFee(null);
    }
  }, [courseId]);

 useEffect(() => {
  if (!batchId || !courseId) {
    setStudents([]);
    return;
  }

  getBatchStudents({
    course: courseId,
    batch: batchId,
  }).then((res) => {
    setStudents(res.data?.data || []);
  });

  setStudentId("");
  setFee(null);

}, [batchId, courseId]);

  /* ================= LOAD FEE ================= */

  useEffect(() => {
    if (studentId) {
      API.get("/fees", { params: { limit: 100 } })
        .then(res => {
          const found = res.data.data.find(
            f => f.student?._id === studentId
          );
          setFee(found || null);
        });
    }
  }, [studentId]);

  /* ================= CREATE FEE ================= */

  const handleCreateFee = async () => {
    if (!totalFees) return alert("Enter total fees");

    await addFee({
      course: courseId,
      batch: batchId,
      student: studentId,
      totalFees,
    });

    setTotalFees("");
    loadFee();
  };

  const loadFee = async () => {
    const res = await API.get("/fees", { params: { limit: 100 } });
    const found = res.data.data.find(
      f => f.student?._id === studentId
    );
    setFee(found || null);
  };

  /* ================= ADD INSTALLMENT ================= */

  const handleAddInstallment = async () => {
    if (!installmentAmount) return alert("Enter amount");

    await addInstallment(fee._id, {
      amount: installmentAmount,
      paymentMode,
    });

    setInstallmentAmount("");
    loadFee();
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold">Student Fee Management</h1>
        <p className="text-sm opacity-90">
          Select student to manage installments
        </p>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow grid grid-cols-3 gap-4">

        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          disabled={!courseId}
          className="border rounded-xl px-4 py-2 disabled:bg-gray-100"
        >
          <option value="">Select Batch</option>
          {batches.map(b => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>

        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={!batchId}
          className="border rounded-xl px-4 py-2 disabled:bg-gray-100"
        >
          <option value="">Select Student</option>
          {students.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

      </div>

      {/* IF NO FEE EXISTS */}
      {studentId && !fee && (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-lg font-semibold">
            Create Fee Record
          </h2>

          <input
            placeholder="Total Fees"
            value={totalFees}
            onChange={(e) => setTotalFees(e.target.value)}
            className="border rounded-xl px-4 py-2 w-full"
          />

          <button
            onClick={handleCreateFee}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Create Fee
          </button>
        </div>
      )}

      {/* IF FEE EXISTS */}
      {fee && (
        <div className="space-y-6">

          {/* SUMMARY */}
          <div className="bg-white p-6 rounded-2xl shadow grid grid-cols-3 gap-4">

            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold">₹{fee.totalFees}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="text-xl font-bold text-green-600">
                ₹{fee.totalPaid}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-red-600">
                ₹{fee.pendingAmount}
              </p>
            </div>

          </div>

          {/* ADD INSTALLMENT */}
          {fee.pendingAmount > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow space-y-4">
              <h3 className="font-semibold">Add Installment</h3>

              <div className="grid grid-cols-2 gap-4">

                <input
                  placeholder="Amount"
                  value={installmentAmount}
                  onChange={(e) => setInstallmentAmount(e.target.value)}
                  className="border rounded-xl px-4 py-2"
                />

                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="border rounded-xl px-4 py-2"
                >
                  {PAYMENT_MODES.map(p => (
                    <option key={p}>{p}</option>
                  ))}
                </select>

              </div>

              <button
                onClick={handleAddInstallment}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
              >
                Add Payment
              </button>
            </div>
          )}

          {/* INSTALLMENT HISTORY */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-4">Payment History</h3>

            {fee.installments.length === 0 ? (
              <p className="text-gray-400">No payments yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-xs uppercase">
                  <tr>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Mode</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fee.installments.map(inst => (
                    <tr key={inst._id} className="border-t">
                      <td className="p-3">₹{inst.amount}</td>
                      <td className="p-3">{inst.paymentMode}</td>
                      <td className="p-3">
                        {new Date(inst.paymentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default Fees;