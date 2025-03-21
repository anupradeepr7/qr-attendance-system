"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import StudentHeader from "@/components/StudentHeader";
import StudentFooter from "@/components/StudentFooter";
import StudentSidebar from "@/components/StudentSidebar";
import DataTable from "react-data-table-component";

export default function AttendanceHistory() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) {
      window.location.href = "/student/login";
      return;
    }

    const studentData = JSON.parse(storedStudent);
    setStudent(studentData);
    fetchAttendance(studentData.rollNo);
  }, []);

  const fetchAttendance = async (rollNo) => {
    if (!rollNo) return;

    try {
      const attendanceRef = collection(db, "attendance");
      const q = query(attendanceRef, where("rollNo", "==", rollNo));
      const querySnapshot = await getDocs(q);

      const records = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();

          // Convert Firestore timestamps to JS dates
          const scans = data.scans
            ? data.scans.map((s) => (s.toDate ? s.toDate() : new Date(s)))
            : [];

          if (scans.length === 0) return null;

          // First & last scan of the day
          const punchIn = scans[0];
          const punchOut = scans.length > 1 ? scans[scans.length - 1] : null;

          return {
            id: doc.id,
            date: data.date || "N/A",
            punchIn: punchIn ? punchIn.toLocaleTimeString() : "N/A",
            punchOut: punchOut ? punchOut.toLocaleTimeString() : "N/A",
            scans, // Store all scans for expandable row
          };
        })
        .filter(Boolean);

      setAttendance(records);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      name: "📅 Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "⏰ Punch In",
      selector: (row) => row.punchIn,
      sortable: true,
    },
    {
      name: "⏰ Punch Out",
      selector: (row) => row.punchOut,
      sortable: true,
    },
  ];

  // Expandable Row Component
  const ExpandedRow = ({ data }) => (
    <div className="p-4 bg-gray-50 rounded-md">
      <h3 className="text-lg font-semibold">🔍 All Scans for {data.date}</h3>
      <ul className="list-disc list-inside mt-2">
        {data.scans.map((scan, index) => (
          <li key={index} className="text-gray-600">
            {new Date(scan).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex ml-64">
      <StudentSidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <StudentHeader />
        <h1 className="text-2xl font-bold">📅 Attendance History</h1>
        <p className="mt-2 text-gray-600">View your past attendance records.</p>

        <div className="mt-6 bg-white shadow-md rounded-lg p-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataTable
              columns={columns}
              data={attendance}
              pagination
              highlightOnHover
              responsive
              expandableRows
              expandableRowsComponent={ExpandedRow}
            />
          )}
        </div>
        <StudentFooter />
      </div>
    </div>
  );
}
