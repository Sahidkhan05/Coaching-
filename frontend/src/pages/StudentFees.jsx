import { useEffect, useState } from "react";
import { getMyFees } from "../api/feeApi";

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await getMyFees();
        setFees(res.data || []);
      } catch (err) {
        console.error("Error fetching fees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500">Loading fees...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold">My Fees</h2>
      </div>

      {!fees.length ? (
        <div className="bg-white p-6 rounded-2xl shadow text-gray-400">
          No fee records found
        </div>
      ) : (
        fees.map((fee) => {
          const lastInstallment =
            fee.installments?.length > 0
              ? fee.installments[fee.installments.length - 1]
              : null;

          const progress =
            fee.totalFees > 0
              ? Math.round(
                  (fee.totalPaid / fee.totalFees) * 100
                )
              : 0;

          return (
            <div
              key={fee._id}
              className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
            >
              {/* KPI CARDS */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Total Fees
                  </p>
                  <h3 className="text-xl font-bold text-indigo-600">
                    ₹{fee.totalFees}
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Paid
                  </p>
                  <h3 className="text-xl font-bold text-green-600">
                    ₹{fee.totalPaid}
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Pending
                  </p>
                  <h3 className="text-xl font-bold text-red-600">
                    ₹{fee.pendingAmount}
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Course
                  </p>
                  <h3 className="text-lg font-semibold">
                    {fee.course?.name || "-"}
                  </h3>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Payment Progress</span>
                  <span>{progress}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Extra Info */}
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                

                <div>
                  <p className="text-gray-500">
                    Last Payment Mode
                  </p>
                  <p className="font-semibold">
                    {lastInstallment
                      ? lastInstallment.paymentMode
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Last Payment Date
                  </p>
                  <p className="font-semibold">
                    {lastInstallment
                      ? new Date(
                          lastInstallment.paymentDate
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Payment History */}
              {fee.installments?.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3 text-gray-600">
                    Payment History
                  </h3>

                  <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3 text-left">
                            Amount
                          </th>
                          <th className="p-3 text-left">
                            Mode
                          </th>
                          <th className="p-3 text-left">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {fee.installments.map((inst) => (
                          <tr
                            key={inst._id}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="p-3">
                              ₹{inst.amount}
                            </td>
                            <td className="p-3">
                              {inst.paymentMode}
                            </td>
                            <td className="p-3">
                              {new Date(
                                inst.paymentDate
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default StudentFees;