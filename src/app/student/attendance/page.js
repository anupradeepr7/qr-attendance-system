"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CryptoJS from "crypto-js";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import StudentHeader from "@/components/StudentHeader";
import StudentFooter from "@/components/StudentFooter";
import StudentSidebar from "@/components/StudentSidebar";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "default-secret";

export default function StudentAttendance() {
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedStudent = typeof window !== "undefined" ? localStorage.getItem("student") : null;

    if (!storedStudent) {
      console.log("Student data missing. Redirecting to login.");
      router.push("/student/login");
    } else {
      const studentData = JSON.parse(storedStudent);

      // ✅ Fix: Check rollNo instead of email
      if (!studentData.rollNo) {
        console.log("Invalid student data. Redirecting to login.");
        localStorage.removeItem("student");
        router.push("/student/login");
      } else {
        setStudent(studentData);
      }
    }
  }, []);

  useEffect(() => {
    if (!student) return;

    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
    scanner.render(onScanSuccess, (err) => console.warn("QR Scan Error:", err));

    return () => scanner.clear();
  }, [student]);

  const onScanSuccess = async (decodedText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(decodedText, SECRET_KEY);
      const decryptedTimestamp = bytes.toString(CryptoJS.enc.Utf8);

      if (!student || !student.rollNo) {
        throw new Error("Student data is missing. Please log in again.");
      }

      await addDoc(collection(db, "attendance"), {
        rollNo: student.rollNo, // ✅ Ensure rollNo is present
        timestamp: decryptedTimestamp,
        punchTime: serverTimestamp(),
      });

      setScanResult("✅ Attendance Marked Successfully!");
    } catch (error) {
      console.error("Error:", error);
      setError(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex">
      <StudentSidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <StudentHeader />
        <div id="qr-reader" className="w-full flex justify-center"></div>
        {scanResult && <h2 className="text-green-600">{scanResult}</h2>}
        {error && <p className="text-red-500">{error}</p>}
        <StudentFooter />
      </div>
    </div>
  );
}
