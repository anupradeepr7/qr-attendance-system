"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const generateQR = () => {
      const ngrokBaseUrl = process.env.NEXT_PUBLIC_NGROK_URL || "https://your-ngrok-url.ngrok.io";
      const timestamp = Date.now(); // Unique timestamp to refresh QR
      setQrData(`${ngrokBaseUrl}/auth?t=${timestamp}`);
    };

    generateQR(); // Generate QR on load
    const interval = setInterval(generateQR, 15000); // Refresh every 15 sec

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 py-10 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-3xl"></div>

      {/* Header */}
      <motion.h1
        className="text-5xl font-bold text-white text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🚀 QR-Based Attendance System 🚀
      </motion.h1>
      <p className="text-gray-300 text-lg text-center max-w-2xl">
        A **fast, secure, and automated** way to mark attendance. No manual entries, just scan & go!
      </p>

      {/* Main Content - Two Sections */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 w-full max-w-6xl gap-8">
        {/* QR Code Section */}
        <motion.div
          className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-xl border border-white/20 md:w-1/2 w-full mx-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Scan to Mark Attendance</h2>
          <motion.div
            className="mt-4 bg-white p-5 rounded-lg shadow-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          >
            {qrData ? <QRCodeCanvas value={qrData} size={220} /> : <p>Generating QR...</p>}
          </motion.div>
          <p className="text-gray-300 mt-3">🔄 QR refreshes every **15 seconds**.</p>
        </motion.div>

        {/* Guidelines Section */}
        <motion.div
          className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20 w-full md:w-1/2 mx-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-4">📌 How It Works:</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-3">
            <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
              📱 <strong>Use your mobile</strong> to scan the QR code.
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
              🔄 **QR updates every 15 sec** to ensure security.
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
              ✅ If your **Gmail exists** in our database, **attendance is auto-marked**.
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
              📌 You’ll be **redirected to the Student Portal** after scanning.
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
              🔑 Log in with **Google Sign-In** or **Roll Number & Date of Birth**.
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} className="cursor-pointer">
              📊 **Check attendance history** and other details inside the portal.
            </motion.li>
          </ul>
        </motion.div>
      </div>

      {/* Additional Information Section */}
      <motion.div
        className="mt-16 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20 w-full max-w-4xl text-left"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">📌 Why Use QR Attendance?</h2>
        <p className="text-gray-300 mb-4">
          Our **AI-powered QR attendance system** is a **smart, fast, and secure** alternative to traditional methods.
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-3">
          <li>⏳ **Saves time** - No manual sign-ins needed.</li>
          <li>🛡️ **Secure** - QR refreshes every **15 sec** to prevent misuse.</li>
          <li>📊 **Real-time tracking** - Monitor attendance with ease.</li>
          <li>✅ **No proxies** - Each student’s Gmail is verified before marking.</li>
        </ul>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="mt-10 w-full max-w-4xl text-left"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">🤔 Frequently Asked Questions</h2>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <details className="mb-3">
            <summary className="cursor-pointer text-blue-400 text-lg">🔹 How does the QR refresh work?</summary>
            <p className="text-gray-300 mt-2">Every **15 seconds**, a new QR code is generated for security.</p>
          </details>
          <details className="mb-3">
            <summary className="cursor-pointer text-blue-400 text-lg">🔹 Can I scan using Google Lens?</summary>
            <p className="text-gray-300 mt-2">Yes! Google Lens or any QR scanner works perfectly.</p>
          </details>
          <details>
            <summary className="cursor-pointer text-blue-400 text-lg">🔹 What if my Gmail is not found?</summary>
            <p className="text-gray-300 mt-2">You won’t be marked present unless your Gmail exists in the database.</p>
          </details>
        </div>
      </motion.div>
    </div>
  );
}
