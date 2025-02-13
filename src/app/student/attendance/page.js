"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { Html5QrcodeScanner } from "html5-qrcode";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";

export default function StudentPanel() {
  const [scanResult, setScanResult] = useState("");
  const { data: session } = useSession();

  const handleScanSuccess = async (decodedText) => {
    setScanResult(decodedText);
    
    if (!session?.user?.email) {
      alert("Error: No student email found!");
      return;
    }

    // Fetch student details from Firestore
    const studentRef = doc(db, "students", session.user.email);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      alert("Error: Student not found!");
      return;
    }

    const studentData = studentSnap.data();

    // Add attendance record
    await addDoc(collection(db, "attendance"), {
      sessionId: decodedText,
      email: session.user.email,
      departmentId: studentData.department,
      rollNo: studentData.rollNo,
      punchTime: new Date(),
      date: new Date().toISOString().split("T")[0], // Store only the date
    });

    alert("Attendance marked successfully!");
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(handleScanSuccess);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="student" />
      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold">Student Panel</h1>
          <button
            onClick={startScanner}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Scan QR Code
          </button>
          <div id="reader" className="mt-6"></div>
          {scanResult && <p className="mt-4 font-semibold">Scanned: {scanResult}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}


