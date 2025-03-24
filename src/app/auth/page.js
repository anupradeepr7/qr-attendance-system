"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
console.log("🔥 Firebase Auth:", auth);
console.log("🔥 Google Provider:", provider);

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleLogin() {
      console.log("🔄 Attempting Google Sign-In...");

      try {
        if (!auth || !provider) throw new Error("❌ Firebase Auth not initialized properly");

        const result = await signInWithPopup(auth, provider);
        if (!result.user) throw new Error("❌ Google Login Failed - No User Found");

        const user = result.user;
        const email = user.email;

        console.log("✅ Google Login Success:", user);
        console.log("📧 Logged-in Email:", email);

        // ✅ Check if the email exists in Firebase
        console.log("🔎 Searching for email in Firestore...");
        const q = query(collection(db, "students"), where("email", "==", email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          // ✅ Email found, mark attendance
          const student = snapshot.docs[0].data();
          console.log("🎓 Student Found in Database:", student);

          const attendanceData = {
            rollNo: student.rollNo,
            email: student.email,
            punchTime: new Date().toLocaleTimeString(),
            timestamp: serverTimestamp(),
          };

          console.log("📝 Marking Attendance:", attendanceData);
          await addDoc(collection(db, "attendance"), attendanceData);

          alert("✅ Attendance Marked Successfully!");
          router.push("/student/dashboard");
        } else {
          console.warn("⚠️ Email Not Found in Database:", email);
          alert("❌ Attendance Failed: Email not registered.");
          router.push("/");
        }
      } catch (error) {
        console.error("🚨 Google Login Error:", error.message, error);

        if (error.code === "auth/popup-closed-by-user") {
          alert("❌ Login Failed: Popup closed by user.");
        } else if (error.code === "auth/cancelled-popup-request") {
          alert("❌ Login Failed: Another login popup was opened.");
        } else {
          alert("❌ Google Login Failed. Check console for details.");
        }

        router.push("/");
      }
    }

    handleLogin();
  }, [router]);

  return <p className="text-center mt-10 text-white">Processing login...</p>;
}
