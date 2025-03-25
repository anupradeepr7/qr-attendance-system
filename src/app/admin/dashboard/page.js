"use client";
import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AdminProtected from "../../../components/AdminProtected";

import Header from "../../../components/AdminHeader";
import Footer from "../../../components/AdminFooter";
import Sidebar from "../../../components/AdminSidebar";

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState("Admin");
  const [studentCount, setStudentCount] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(0);

  useEffect(() => {
    // Get Admin Name
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminName(user.email.split("@")[0]); // Use email as username
      }
    });

    // Fetch Total Students Count
    const fetchStudents = async () => {
      const studentsSnapshot = await getDocs(collection(db, "students"));
      setStudentCount(studentsSnapshot.size);
    };

    // Fetch Today's Attendance Count
    const fetchTodayAttendance = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfDay = Timestamp.fromDate(today);

      const q = query(collection(db, "attendance"), where("timestamp", ">=", startOfDay));
      const attendanceSnapshot = await getDocs(q);
      setTodayAttendance(attendanceSnapshot.size);
    };

    fetchStudents();
    fetchTodayAttendance();
  }, []);

  return (
    <AdminProtected>
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {adminName}!</h1>
          <p className="text-gray-600">Here is your dashboard overview:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Total Students Card */}
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Total Students</h2>
              <p className="text-3xl font-semibold mt-2">{studentCount}</p>
            </div>
            {/* Today's Attendance Card */}
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Today's Attendance</h2>
              <p className="text-3xl font-semibold mt-2">{todayAttendance}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
      </AdminProtected>
  );
}
