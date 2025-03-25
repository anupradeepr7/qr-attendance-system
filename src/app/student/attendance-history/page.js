"use client";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import StudentHeader from "../../../components/StudentHeader";
import StudentFooter from "../../../components/StudentFooter";
import StudentSidebar from "../../../components/StudentSidebar";
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

      let groupedAttendance = {};

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();

        // ✅ Ensure timestamp is correctly converted
        let timestamp;
        if (data.timestamp?.toDate) {
          timestamp = data.timestamp.toDate();
        } else if (typeof data.timestamp === "string") {
          timestamp = new Date(data.timestamp);
        } else {
          timestamp = new Date();
        }

        // ✅ Ensure correct date format (YYYY-MM-DD)
        const dateKey = timestamp.toISOString().split("T")[0];

        // ✅ Ensure punchTime is always formatted correctly
        const timeString = formatTime(data.punchTime, timestamp);

        if (!groupedAttendance[dateKey]) {
          groupedAttendance[dateKey] = { scans: [] };
        }

        groupedAttendance[dateKey].scans.push({
          time: timeString,
          timestamp: timestamp,
        });
      });

      // ✅ Process attendance records (extract first punch-in and last punch-out)
      const records = Object.keys(groupedAttendance).map((date) => {
        const scans = groupedAttendance[date].scans.sort((a, b) => a.timestamp - b.timestamp);
        return {
          id: date,
          date: formatDate(date),
          punchIn: scans[0]?.time || "N/A",
          punchOut: scans.length > 1 ? scans[scans.length - 1].time : "N/A",
          scans,
        };
      });

      setAttendance(records);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching attendance:", error);
      setLoading(false);
    }
  };

  // ✅ Function to format date as "YYYY-MM-DD" to "March 25, 2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ✅ Function to ensure correct time format (9:46:35 AM)
  const formatTime = (timeString, timestamp) => {
    if (!timeString || timeString === "Invalid Date") {
      return timestamp.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    }

    const date = new Date(`2000-01-01T${timeString}`);
    if (isNaN(date.getTime())) {
      return timestamp.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // 📊 Table columns
  const columns = [
    {
      name: "📅 Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "⏰ First Punch",
      selector: (row) => row.punchIn,
      sortable: true,
    },
    {
      name: "⏰ Last Punch",
      selector: (row) => row.punchOut,
      sortable: true,
    },
  ];

  // 🔍 Expandable Row Component
  const ExpandedRow = ({ data }) => (
    <div className="p-4 bg-gray-50 rounded-md">
      <h3 className="text-lg font-semibold">🔍 All Scans for {data.date}</h3>
      <ul className="list-disc list-inside mt-2">
        {data.scans.map((scan, index) => (
          <li key={index} className="text-gray-600">
            {scan.time}
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
