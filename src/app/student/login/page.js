"use client";
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";


export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const studentQuery = query(collection(db, "students"), where("email", "==", email), where("dob", "==", dob));
    const studentSnapshot = await getDocs(studentQuery);

    if (!studentSnapshot.empty) {
      localStorage.setItem("studentEmail", email);
      router.push("/student/dashboard");
    } else {
      setError("Invalid email or date of birth.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
   
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold">Student Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
        </form>
      </div>
   
    </div>
  );
}

