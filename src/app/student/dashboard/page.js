"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import StudentHeader from "@/components/StudentHeader";
import StudentFooter from "@/components/StudentFooter";
import StudentSidebar from "@/components/StudentSidebar";

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [todayPunchTime, setTodayPunchTime] = useState(null);

  useEffect(() => {
    // ✅ Ensure localStorage access only runs on client-side
    if (typeof window !== "undefined") {
      const storedStudent = localStorage.getItem("student");

      if (!storedStudent) {
        console.log("Student data missing. Redirecting to login.");
        router.push("/student/login");
      } else {
        const studentData = JSON.parse(storedStudent);

        // ✅ Validate student data before setting state
        if (!studentData.rollNo) {
          console.log("Invalid student data. Redirecting to login.");
          localStorage.removeItem("student");
          router.push("/student/login");
        } else {
          setStudent(studentData);
          fetchTodayAttendance(studentData.rollNo);
        }
      }
    }
  }, []);

  const fetchTodayAttendance = async (rollNo) => {
    if (!rollNo) return;

    try {
      const attendanceRef = collection(db, "attendance");
      const q = query(attendanceRef, where("rollNo", "==", rollNo));

      const querySnapshot = await getDocs(q);

      // ✅ Filter today's attendance manually (avoiding index error)
      const today = new Date().setHours(0, 0, 0, 0);
      const todayAttendance = querySnapshot.docs
        .map(doc => doc.data())
        .filter(attendance => 
          new Date(attendance.punchTime.seconds * 1000).setHours(0, 0, 0, 0) === today
        );

      if (todayAttendance.length > 0) {
        setTodayPunchTime(new Date(todayAttendance[0].punchTime.seconds * 1000).toLocaleTimeString());
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    <div className="flex">
      <StudentSidebar />
      <div className="flex-1">
        <StudentHeader />
        <main className="p-6 bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-bold">Welcome, {student?.name || "Student"}!</h1>
          <p className="mt-2">This is your student dashboard.</p>

          {todayPunchTime && (
            <p className="mt-4 text-lg text-green-600 font-semibold">
              ✅ Today's Punch-in Time: {todayPunchTime}
            </p>
          )}
        </main>
        <StudentFooter />
      </div>
    </div>
  );
}
