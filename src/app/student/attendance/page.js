"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CryptoJS from "crypto-js";
import StudentHeader from "@/components/StudentHeader";
import StudentFooter from "@/components/StudentFooter";
import StudentSidebar from "@/components/StudentSidebar";
import { Html5QrcodeScanner } from "html5-qrcode";
import { FaQrcode, FaCheckCircle, FaSyncAlt } from "react-icons/fa";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "default-secret";

export default function StudentAttendance() {
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const [cameraFacingMode, setCameraFacingMode] = useState("environment"); // ✅ Back Camera Default
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    if (!scanner) {
      const qrScanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
        facingMode: cameraFacingMode, // ✅ Back Camera
      });

      qrScanner.render(
        async (decodedText) => {
          qrScanner.pause();
          await handleScan(decodedText);
          qrScanner.resume();
        },
        (err) => {
          console.warn("QR Scan Error:", err);
          setError("❌ Camera access error. Please allow permissions.");
        }
      );

      setScanner(qrScanner);
    }

    return () => {
      if (scanner) scanner.clear();
    };
  }, [cameraFacingMode, scanner]);

  const handleScan = async (decodedText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(decodedText, SECRET_KEY);
      const decryptedTimestamp = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedTimestamp) {
        setError("❌ Invalid QR Code! Please try again.");
        return;
      }

      // ✅ Save attendance
      await addDoc(collection(db, "attendance"), {
        timestamp: serverTimestamp(),
      });

      setScanResult("✅ Attendance Marked Successfully!");
      setError("");
    } catch (error) {
      console.error("Error processing QR code:", error);
      setError("❌ Invalid QR Code! Please try again.");
    }
  };

  // Toggle Front/Back Camera
  const toggleCamera = () => {
    setCameraFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
    setScanner(null); // Reset scanner to apply new camera mode
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
                <FaCheckCircle /> {scanResult}
              </h2>
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
