"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import StudentHeader from "@/components/StudentHeader";
import StudentFooter from "@/components/StudentFooter";
import StudentSidebar from "@/components/StudentSidebar";
import { Html5QrcodeScanner } from "html5-qrcode";
import { FaQrcode, FaCheckCircle, FaSyncAlt } from "react-icons/fa";

export default function StudentAttendance() {
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const [cameraFacingMode, setCameraFacingMode] = useState("environment"); // Back Camera

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
      facingMode: cameraFacingMode, // Use back camera by default
    });

    scanner.render(
      (decodedText) => {
        handleScan(decodedText);
        scanner.clear();
      },
      (err) => {
        console.warn("QR Scan Error:", err);
        setError("❌ Camera access error. Please allow permissions.");
      }
    );

    return () => scanner.clear(); // Cleanup when unmounting
  }, [cameraFacingMode]);

  const handleScan = async (decodedText) => {
    setScanResult(decodedText);
    setError("");

    try {
      await addDoc(collection(db, "attendance"), {
        rollNo: decodedText,
        punchTime: new Date().toLocaleTimeString(),
        timestamp: serverTimestamp(),
      });
      alert("✅ Attendance Marked Successfully!");
    } catch (err) {
      console.error("Error marking attendance:", err);
      setError("❌ Failed to mark attendance. Try again.");
    }
  };

  // Toggle between front & back camera
  const toggleCamera = () => {
    setCameraFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="flex">
      <StudentSidebar />
      <div className="flex-1 p-6 min-h-screen bg-gray-100">
        <StudentHeader />
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 flex items-center justify-center gap-2">
            <FaQrcode /> Mark Your Attendance
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Align the QR code in the camera view to mark your attendance.
          </p>

          {/* QR Scanner */}
          <div id="qr-reader" className="w-full flex justify-center"></div>

          {/* Toggle Camera Button */}
          <button
            onClick={toggleCamera}
            className="mt-4 bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 mx-auto"
          >
            <FaSyncAlt /> Switch Camera
          </button>

          {/* Scan Success Message */}
          {scanResult && (
            <div className="mt-6 text-center">
              <h2 className="text-xl font-semibold text-green-600 flex items-center justify-center gap-2">
                <FaCheckCircle /> Attendance Marked!
              </h2>
              <p className="text-gray-700">📌 Roll No: <b>{scanResult}</b></p>
              <p className="text-gray-700">🕒 Punch Time: <b>{new Date().toLocaleTimeString()}</b></p>
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
        <StudentFooter />
      </div>
    </div>
  );
}
