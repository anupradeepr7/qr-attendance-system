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

  // ✅ Format Timestamp Correctly
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "N/A";
    const date = timestamp.toDate();
    return {
      date: date.toLocaleDateString("en-CA"), // YYYY-MM-DD format for search
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };
  };

  // ✅ Apply Filters
  const filteredAttendance = attendance.filter((record) => {
    const formatted = formatDate(record.punchTime);
    return (
      (searchRollNo === "" || record.rollNo.toLowerCase().includes(searchRollNo.toLowerCase())) &&
      (searchDate === "" || formatted.date === searchDate)
    );
  });

  // ✅ Export to CSV (Date First, Time Second)
  const exportToCSV = () => {
    const csvRows = [];
    const headers = ["Roll Number", "Student Name", "Email", "Date", "Punch Time"];
    csvRows.push(headers.join(","));

    filteredAttendance.forEach((record) => {
      const formatted = formatDate(record.punchTime);
      csvRows.push([record.rollNo, record.name || "N/A", record.email || "N/A", formatted.date, formatted.time].join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
  };

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
            <button className="p-2 bg-green-500 text-white rounded" onClick={exportToCSV}>
              📥 Export CSV
            </button>
          </div>

          {/* 📊 Attendance Summary */}
          <div className="mb-4 text-lg font-semibold">
            Total Attendance Records: <span className="text-blue-600">{filteredAttendance.length}</span>
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
                    <th className="py-2 px-4 border">Student Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Date</th> {/* ⬅ Moved Date Before Time */}
                    <th className="py-2 px-4 border">Punch Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((record) => {
                      const formatted = formatDate(record.punchTime);
                      return (
                        <tr key={record.id} className="border">
                          <td className="py-2 px-4 border">{record.rollNo}</td>
                          <td className="py-2 px-4 border">{record.name || "N/A"}</td>
                          <td className="py-2 px-4 border">{record.email || "N/A"}</td>
                          <td className="py-2 px-4 border">{formatted.date}</td> {/* ⬅ Date Column First */}
                          <td className="py-2 px-4 border">{formatted.time}</td> {/* ⬅ Time Column Second */}
                        </tr>
                      );
                    })
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
