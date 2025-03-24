"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Sidebar from "@/components/AdminSidebar";
import Header from "@/components/AdminHeader";
import Footer from "@/components/AdminFooter";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchRollNo, setSearchRollNo] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const attendanceSnapshot = await getDocs(collection(db, "attendance"));
        const attendanceData = attendanceSnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            rollNo: data.rollNo,
            date: data.date, // Already stored as string, so no reformatting needed
            punchIn: data.punchIn?.toDate() || null,
            punchOut: data.punchOut?.toDate() || null,
          };
        });

        setAttendance(attendanceData);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // ✅ Store formatted timestamps in state to avoid SSR mismatch
  const [formattedAttendance, setFormattedAttendance] = useState([]);

  useEffect(() => {
    setFormattedAttendance(
      attendance.map((record) => ({
        ...record,
        punchIn: record.punchIn
          ? new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }).format(record.punchIn)
          : "N/A",
        punchOut: record.punchOut
          ? new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }).format(record.punchOut)
          : "N/A",
      }))
    );
  }, [attendance]);

  // ✅ Apply Filters
  const filteredAttendance = formattedAttendance.filter((record) => {
    return (
      (searchRollNo === "" || record.rollNo.toLowerCase().includes(searchRollNo.toLowerCase())) &&
      (searchDate === "" || record.date === searchDate)
    );
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">📌 Student Attendance</h1>

          {/* 🔎 Filters */}
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

          {/* 📜 Attendance Table */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 border">Roll Number</th>
                    <th className="py-2 px-4 border">Date</th>
                    <th className="py-2 px-4 border">Punch-In</th>
                    <th className="py-2 px-4 border">Punch-Out</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((record) => (
                      <tr key={record.id} className="border">
                        <td className="py-2 px-4 border">{record.rollNo}</td>
                        <td className="py-2 px-4 border">{record.date}</td>
                        <td className="py-2 px-4 border">{record.punchIn}</td>
                        <td className="py-2 px-4 border">{record.punchOut}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
