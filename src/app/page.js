"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const ngrokBaseUrl = process.env.NEXT_PUBLIC_NGROK_URL || "https://your-ngrok-url.ngrok.io";
    const authUrl = `${ngrokBaseUrl}/auth`;
    setQrData(authUrl);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-900 text-white px-6 py-10 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-3xl"></div>

      {/* Left Section - QR Code */}
      <motion.div
        className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-xl border border-white/20 md:w-1/2 w-full mx-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">QR Attendance System</h1>
        <p className="text-gray-300 text-center">Scan the QR Code to mark your attendance</p>

        {/* Animated QR Code */}
        <motion.div
          className="mt-6 bg-white p-4 rounded-lg shadow-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
        >
          {qrData ? <QRCodeCanvas value={qrData} size={220} /> : <p>Generating QR...</p>}
        </motion.div>

        {/* Show the Ngrok URL for manual access */}
        <p className="text-gray-300 mt-4">
          🔗 Ngrok URL:{" "}
          <a href={qrData} className="text-blue-400 underline">
            {qrData}
          </a>
        </p>
      </motion.div>

      {/* Right Section - Guidelines */}
      <motion.div
        className="mt-10 md:mt-0 md:ml-10 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20 w-full md:w-1/2 mx-4"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-white">📌 How to Mark Attendance:</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-3">
          <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
            📱 <strong>Use your mobile device</strong> to scan the QR code.
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
            🔄 <strong>Your Gmail ID will be fetched automatically</strong>.
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
            ✅ If your Gmail exists in our database, <strong>your attendance is marked instantly</strong>.
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
            📌 After marking attendance, you will be redirected to the <strong>Student Login Portal</strong>.
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
            🔑 You can log in using <strong>Google Sign-In</strong> or <strong>Roll Number & Date of Birth</strong>.
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
            📊 Once logged in, you can check your <strong>attendance history</strong> and other details.
          </motion.li>
        </ul>
      </motion.div>
    </div>
  );
}
