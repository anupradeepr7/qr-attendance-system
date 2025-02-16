"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchRollNo, setSearchRollNo] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const attendanceSnapshot = await getDocs(collection(db, "attendance"));
        const attendanceData = attendanceSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAttendance(attendanceData);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Apply filters based on Roll Number and Date
  const filteredAttendance = attendance.filter((record) => {
    const punchDate = new Date(record.punchTime).toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
    return (
      (searchRollNo === "" || record.rollNo.toLowerCase().includes(searchRollNo.toLowerCase())) &&
      (searchDate === "" || punchDate === searchDate)
    );
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Student Attendance</h1>

          {/* Filter Inputs */}
          <div className="mb-4 flex gap-4">
            <input
              type="text"
              placeholder="Search by Roll No"
              className="p-2 border rounded w-1/3"
              value={searchRollNo}
              onChange={(e) => setSearchRollNo(e.target.value)}
            />
            <input
              type="date"
              className="p-2 border rounded w-1/3"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <button
              className="p-2 bg-red-500 text-white rounded"
              onClick={() => {
                setSearchRollNo("");
                setSearchDate("");
              }}
            >
              Reset
            </button>
          </div>

          {/* Attendance Table */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">Roll Number</th>
                  <th className="py-2 px-4 border">Punch Time</th>
                  <th className="py-2 px-4 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((record) => (
                    <tr key={record.id} className="border">
                      <td className="py-2 px-4 border">{record.rollNo}</td>
                      <td className="py-2 px-4 border">
                        {new Date(record.punchTime).toLocaleTimeString()}
                      </td>
                      <td className="py-2 px-4 border">
                        {new Date(record.punchTime).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
