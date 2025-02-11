"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentHeader from "@/components/StudentHeader";
import StudentFooter from "@/components/StudentFooter";
import StudentSidebar from "@/components/StudentSidebar";

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) {
      router.push("/student/login");
    } else {
      setStudent(JSON.parse(storedStudent));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("student");
    router.push("/student/login");
  };

  return (
    <div className="flex">
      <StudentSidebar />
      <div className="flex-1">
        <StudentHeader onLogout={handleLogout} />
        <main className="p-6 bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-bold">Welcome, {student?.name || "Student"}!</h1>
          <p className="mt-2">This is your student dashboard.</p>
        </main>
        <StudentFooter />
      </div>
    </div>
  );
}
