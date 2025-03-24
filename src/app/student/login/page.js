"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

export default function StudentLogin() {
  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState(""); // YYYY-MM-DD format
  const [error, setError] = useState("");
  const router = useRouter();

  // 📌 Roll Number & DOB Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const formattedRollNo = rollNo.trim();
    const formattedDob = dob.trim(); // Make sure it's in YYYY-MM-DD

    if (!formattedRollNo || !formattedDob) {
      setError("Roll Number and Date of Birth are required.");
      return;
    }

    try {
      const q = query(
        collection(db, "students"),
        where("rollNo", "==", formattedRollNo),
        where("dob", "==", formattedDob)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const studentData = querySnapshot.docs[0].data();
        console.log("Login Successful:", studentData);

        // ✅ Store student data in localStorage
        localStorage.setItem("student", JSON.stringify(studentData));

        // ✅ Redirect to dashboard
        router.push("/student/dashboard");
      } else {
        setError("Invalid Roll Number or Date of Birth.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please try again.");
    }
  };

  // 📌 Google Sign-In Login
  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Check if user exists in Firebase Database
      const q = query(collection(db, "students"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const studentData = querySnapshot.docs[0].data();
        console.log("Google Login Successful:", studentData);

        // ✅ Store student data in localStorage
        localStorage.setItem("student", JSON.stringify(studentData));

        // ✅ Redirect to dashboard
        router.push("/student/dashboard");
      } else {
        setError("No account found for this email. Please scan the QR code first.");
      }
    } catch (err) {
      console.error("Google Sign-In failed:", err);
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Student Login</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* 📌 Roll Number & DOB Login */}
        <form onSubmit={handleLogin}>
          <label className="block">Roll Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="Enter your Roll Number"
            required
          />

          <label className="block mt-4">Date of Birth</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4">
            Login
          </button>
        </form>

        {/* 📌 Google Sign-In Login */}
        <div className="text-center mt-4">
          <p className="text-gray-600">or</p>
          <button
            onClick={handleGoogleLogin}
            className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
