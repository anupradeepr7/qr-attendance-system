"use client";
import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import CryptoJS from "crypto-js";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import StudentHeader from "../../../components/StudentHeader";
import StudentFooter from "../../../components/StudentFooter";
import StudentSidebar from "../../../components/StudentSidebar";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "default-secret";

export default function StudentAttendance() {
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) {
      router.push("/student/login");
    } else {
      const studentData = JSON.parse(storedStudent);
      if (!studentData.rollNo) {
        localStorage.removeItem("student");
        router.push("/student/login");
      } else {
        setStudent(studentData);
      }
    }
  }, []);

  useEffect(() => {
    if (!student || !scannerActive || scannerRef.current) return;

    scannerRef.current = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scannerRef.current.render(onScanSuccess, (err) =>
      console.warn("QR Scan Error:", err)
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [student, scannerActive]);

  const onScanSuccess = async (decodedText) => {
    if (!scannerActive || isScanning) return;
    setIsScanning(true);

    try {
      // Decrypt QR Code
      const bytes = CryptoJS.AES.decrypt(decodedText, SECRET_KEY);
      const decryptedTimestamp = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedTimestamp) throw new Error("Invalid QR Code. Unable to decrypt.");

      const today = new Date().toISOString().split("T")[0];
      if (!student || !student.rollNo) throw new Error("Student data is missing. Please log in again.");

      const attendanceQuery = query(
        collection(db, "attendance"),
        where("rollNo", "==", student.rollNo),
        where("date", "==", today)
      );
      const snapshot = await getDocs(attendanceQuery);

      const now = new Date();
      let lastScanTime = null;

      if (!snapshot.empty) {
        const attendanceDoc = snapshot.docs[0];
        const attendanceRef = doc(db, "attendance", attendanceDoc.id);
        const attendanceData = attendanceDoc.data();

        lastScanTime = attendanceData.lastScan ? attendanceData.lastScan.toDate() : null;

        // Prevent multiple scans within the same minute
        if (lastScanTime && (now - lastScanTime) / 1000 < 60) {
          setError("❌ Please wait at least 1 minute before scanning again.");
          setTimeout(() => setError(""), 5000);
          return;
        }

        let updatedScans = attendanceData.scans ? [...attendanceData.scans, now] : [now];

        if (!attendanceData.punchOut) {
          // First Punch-out
          await updateDoc(attendanceRef, {
            punchOut: now,
            scans: updatedScans,
            lastScan: now,
          });

          setScanResult("✅ Punch-out Successful!");
        } else {
          // Additional scans after punch-out
          await updateDoc(attendanceRef, {
            scans: updatedScans,
            lastScan: now,
          });
          setScanResult("✅ Scan Recorded!");
        }
      } else {
        // First punch-in of the day
        await addDoc(collection(db, "attendance"), {
          rollNo: student.rollNo,
          punchIn: now,
          punchOut: null,
          lastScan: now,
          scans: [now],
          date: today,
        });

        setScanResult("✅ Punch-in Successful!");
      }

      setScannerActive(false);
    } catch (error) {
      setError(`❌ ${error.message}`);
    } finally {
      setTimeout(() => setIsScanning(false), 5000);
    }
  };

  return (
    <div className="flex ml-64">
      <StudentSidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <StudentHeader />
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-700">Scan QR Code</h1>
          {scannerActive && <div id="qr-reader"></div>}

          {scanResult && (
            <p className="mt-4 text-green-600 text-lg font-semibold">{scanResult}</p>
          )}
          {error && (
            <p className="mt-4 text-red-500 text-lg font-semibold">{error}</p>
          )}

          {scanResult && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => setScannerActive(true)}
            >
              Scan Again
            </button>
          )}
        </div>
        <StudentFooter />
      </div>
    </div>
  );
}
