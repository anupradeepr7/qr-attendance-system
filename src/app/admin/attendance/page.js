"use client";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../../../components/AdminSidebar";
import Header from "../../../components/AdminHeader";
import Footer from "../../../components/AdminFooter";
import DataTable from "react-data-table-component";

export default function AdminAttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const attendanceRef = collection(db, "attendance");
      const querySnapshot = await getDocs(attendanceRef);

      let groupedAttendance = {};

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const rollNo = data.rollNo;

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

        if (!groupedAttendance[rollNo]) {
          groupedAttendance[rollNo] = {};
        }

        if (!groupedAttendance[rollNo][dateKey]) {
          groupedAttendance[rollNo][dateKey] = { scans: [] };
        }

        groupedAttendance[rollNo][dateKey].scans.push({
          time: timeString,
          timestamp: timestamp,
        });
      });

      // ✅ Process attendance records (extract first punch-in and last punch-out)
      const records = [];
      Object.keys(groupedAttendance).forEach((rollNo) => {
        Object.keys(groupedAttendance[rollNo]).forEach((date) => {
          const scans = groupedAttendance[rollNo][date].scans.sort((a, b) => a.timestamp - b.timestamp);
          records.push({
            id: `${rollNo}-${date}`,
            rollNo,
            date: formatDate(date),
            punchIn: scans[0]?.time || "N/A",
            punchOut: scans.length > 1 ? scans[scans.length - 1].time : "N/A",
            scans,
          });
        });
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
      name: "📌 Roll Number",
      selector: (row) => row.rollNo,
      sortable: true,
    },
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
      <h3 className="text-lg font-semibold">🔍 All Scans for {data.date} (Roll No: {data.rollNo})</h3>
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Header />
        <h1 className="text-2xl font-bold">📌 Attendance Records</h1>
        <p className="mt-2 text-gray-600">View all student attendance records.</p>

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
        <Footer />
      </div>
    </div>
  );
}
