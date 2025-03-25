"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaUserGraduate, FaClock, FaBell, FaBookOpen } from "react-icons/fa";
import StudentSidebar from "../../../components/StudentSidebar";
import StudentHeader from "../../../components/StudentHeader";
import StudentFooter from "../../../components/StudentFooter";

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [firstPunchIn, setFirstPunchIn] = useState(null);
  const [lastPunchOut, setLastPunchOut] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedStudent = localStorage.getItem("student");

      if (!storedStudent) {
        router.push("/student/login");
      } else {
        const studentData = JSON.parse(storedStudent);
        if (!studentData.rollNo) {
          localStorage.removeItem("student");
          router.push("/student/login");
        } else {
          setStudent(studentData);
          fetchAttendanceData(studentData.rollNo);
        }
      }
    }
  }, []);

  const fetchAttendanceData = async (rollNo) => {
    if (!rollNo) return;

    try {
      const attendanceRef = collection(db, "attendance");
      const q = query(attendanceRef, where("rollNo", "==", rollNo));
      const querySnapshot = await getDocs(q);

      let todayScans = [];

      const todayDate = new Date();
      const todayString = todayDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        let timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);

        const entryDate = timestamp.toISOString().split("T")[0]; // Extract YYYY-MM-DD

        if (entryDate === todayString) {
          todayScans.push(timestamp);
        }
      });

      todayScans.sort((a, b) => a - b); // Sort by time

      setFirstPunchIn(todayScans.length > 0 ? formatTime(todayScans[0]) : "Not Marked Yet");
      setLastPunchOut(todayScans.length > 1 ? formatTime(todayScans[todayScans.length - 1]) : "Not Marked Yet");

    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // ✅ Convert date object to readable time format
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex ml-64">
      <StudentSidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <StudentHeader />
        <main className="p-6 bg-gray-100 min-h-screen">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-700">
              🎓 Welcome, {student?.name || "Student"}!
            </h1>
            <p className="text-gray-600 mt-1">
              Your student dashboard provides all your academic details.
            </p>

            {/* Student Profile Card */}
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6 flex items-center gap-4">
              <FaUserGraduate className="text-blue-500 text-5xl" />
              <div>
                <h2 className="text-xl font-semibold">{student?.name}</h2>
                <p className="text-gray-600">🎟️ Roll No: {student?.rollNo}</p>
                <p className="text-gray-600">📚 Department: {student?.department}</p>
                <p className="text-gray-600">🎓 Year: {student?.year}</p>
              </div>
            </div>

            {/* Attendance & Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4">
                <FaClock className="text-purple-500 text-5xl" />
                <div>
                  <h2 className="text-xl font-semibold">{firstPunchIn}</h2>
                  <p className="text-gray-600">Today's First Punch</p>
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4">
                <FaClock className="text-red-500 text-5xl" />
                <div>
                  <h2 className="text-xl font-semibold">{lastPunchOut}</h2>
                  <p className="text-gray-600">Today's Last Punch</p>
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaBell className="text-yellow-500" /> Announcements
              </h2>
              <ul className="mt-3 list-disc list-inside text-gray-600">
                <li>📢 College annual fest registrations open until March 31st!</li>
                <li>📝 Mid-term exams start from April 10th. Check your timetable.</li>
                <li>🎓 Career counseling session on April 5th at 10 AM.</li>
              </ul>
            </div>

            {/* Upcoming Events */}
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaBookOpen className="text-blue-500" /> Upcoming Classes / Events
              </h2>
              <ul className="mt-3 list-disc list-inside text-gray-600">
                <li>📖 Advanced Mathematics - April 2nd, 10:00 AM</li>
                <li>🖥️ Web Development Workshop - April 3rd, 2:00 PM</li>
                <li>🤖 AI & ML Seminar - April 7th, 11:00 AM</li>
              </ul>
            </div>
          </div>
        </main>
        <StudentFooter />
      </div>
    </div>
  );
}
