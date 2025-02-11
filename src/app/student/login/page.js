"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const studentRef = doc(db, "students", email);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        setError("Student not found. Please check your credentials.");
        return;
      }

      const studentData = studentSnap.data();
      if (studentData.dob !== dob) {
        setError("Invalid Date of Birth. Please try again.");
        return;
      }

      localStorage.setItem("student", JSON.stringify(studentData));
      router.push("/student/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Student Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="date"
            className="w-full px-4 py-2 border rounded"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
