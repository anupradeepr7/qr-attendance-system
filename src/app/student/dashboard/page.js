
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const studentToken = localStorage.getItem("studentToken");
    if (!studentToken) {
      router.push("/student/login");
    } else {
      setStudent(studentToken);
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("studentToken");
    router.push("/student/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-6 bg-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, Student!</h1>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <Footer />
    </div>
  );
}
