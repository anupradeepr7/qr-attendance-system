"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import CryptoJS from "crypto-js";

export default function LandingPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [qrData, setQrData] = useState("");
  const [ngrokUrl, setNgrokUrl] = useState(process.env.NEXT_PUBLIC_NGROK_URL || ""); // Remote Access URL

  // Function to generate encrypted QR data (Only Timestamp)
  const generateQrData = () => {
    const timestamp = new Date().toISOString(); // Current date & time
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "default-secret"; // Secret key for encryption
    const encryptedData = CryptoJS.AES.encrypt(timestamp, secretKey).toString();
    setQrData(encryptedData);
  };

  // Update QR Code every 10 seconds
  useEffect(() => {
    generateQrData();
    const interval = setInterval(generateQrData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update Live Clock every second
  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date().toLocaleTimeString());
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 px-6">
      {/* Main QR Code Box */}
      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-gray-700 w-full max-w-lg text-center">
        <h1 className="text-4xl font-extrabold text-blue-400 tracking-wide drop-shadow-md">
          QR Attendance System
        </h1>
        <p className="text-gray-300 mt-2 text-lg">Fast & Secure Attendance</p>

        {/* Live Clock */}
        {currentTime && (
          <div className="mt-4 text-2xl font-semibold bg-gray-800 text-white px-6 py-2 rounded-lg shadow-lg border border-gray-600">
            🕒 {currentTime}
          </div>
        )}

        {/* QR Code Box */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-gray-700 shadow-lg flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-md border border-blue-400">
            {qrData ? (
              <QRCodeCanvas value={qrData} size={220} className="shadow-lg border border-gray-300 rounded-lg" />
            ) : (
              <p className="text-red-500">Generating QR Code...</p>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">🔄 QR updates every 10 sec</p>
      </div>

      {/* Remote Access QR Code (Compact, Top-Right) */}
      {ngrokUrl && (
        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-xl p-4 rounded-lg border border-gray-700 shadow-lg">
          <h2 className="text-xs font-bold text-blue-400">🌍 Remote Access</h2>
          <QRCodeCanvas value={ngrokUrl} size={80} className="shadow-md border border-gray-500 rounded bg-white p-1" />
          <p className="text-xs text-gray-400 mt-1 text-center">
            <a href={ngrokUrl} target="_blank" className="text-blue-300 underline">
              Open System
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
