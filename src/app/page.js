"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function LandingPage() {
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const ngrokBaseUrl = process.env.NEXT_PUBLIC_NGROK_URL || "https://your-ngrok-url.ngrok.io";
    const authUrl = `${ngrokBaseUrl}/auth`;
    setQrData(authUrl);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6">
      <h1 className="text-4xl font-bold">QR Attendance System</h1>
      <p className="text-gray-400 mt-2 text-center">
        Scan the QR Code to mark your attendance. Follow the steps below.
      </p>

      {/* QR Code */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
        {qrData ? <QRCodeCanvas value={qrData} size={220} /> : <p>Generating QR...</p>}
      </div>

      {/* Steps to Mark Attendance */}
      <div className="mt-8 bg-gray-800 p-6 rounded-lg w-full max-w-lg text-left">
        <h2 className="text-xl font-semibold mb-4">📌 How to Mark Attendance:</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>📱 **Use your mobile device** to scan the QR code.</li>
          <li>🔄 **Your Gmail ID will be fetched automatically**.</li>
          <li>✅ If your Gmail exists in our database, your attendance is marked instantly.</li>
          <li>📌 After marking attendance, you will be redirected to the **Student Login Portal**.</li>
          <li>🔑 You can log in using **Google Sign-In** or **Roll Number & Date of Birth**.</li>
          <li>📊 Once logged in, you can check your **attendance history and other details**.</li>
        </ul>
      </div>

      {/* Show the Ngrok URL for manual access */}
      <p className="text-gray-400 mt-4">
        🔗 Ngrok URL:{" "}
        <a href={qrData} className="text-blue-400 underline">
          {qrData}
        </a>
      </p>
    </div>
  );
}
