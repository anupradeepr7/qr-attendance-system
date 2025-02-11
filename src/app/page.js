"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import CryptoJS from "crypto-js";
import Image from "next/image";

export default function LandingPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [qrData, setQrData] = useState("");

    // Function to generate encrypted QR data
    const generateQrData = () => {
        const timestamp = new Date().toISOString();
        const encryptedData = CryptoJS.AES.encrypt(timestamp, "secret-key").toString();
        setQrData(encryptedData);
    };

    // Update time and QR code every 10 seconds
    useEffect(() => {
        generateQrData();
        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
        const qrInterval = setInterval(generateQrData, 10000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(qrInterval);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black relative overflow-hidden">
            {/* Background Gradient & Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-500 to-indigo-600 opacity-60 blur-2xl"></div>
            <div className="absolute w-96 h-96 bg-purple-400 opacity-30 rounded-full blur-3xl top-1/4 left-1/4"></div>
            <div className="absolute w-80 h-80 bg-blue-500 opacity-30 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

            {/* Logo & Title */}
            <div className="relative flex flex-col items-center z-10">
                {/* <Image src="/logo.webp" alt="Logo" width={100} height={100} className="animate-pulse" /> */}
                <h1 className="text-5xl font-extrabold text-white mt-4">QR Attendance System</h1>
                <p className="text-lg text-gray-300 mt-2">Secure & Fast Attendance Marking</p>
            </div>

            {/* Live Clock Display */}
            <div className="relative mt-6 text-2xl font-bold text-white px-6 py-3 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-xl backdrop-blur-lg border border-gray-500 animate-glow">
                🕒 {currentTime.toLocaleTimeString()}
            </div>

            {/* QR Code Box */}
            <div className="relative mt-8 bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-300 backdrop-blur-md">
                <p className="text-gray-700 font-semibold mb-2">Scan to Mark Attendance</p>
                <QRCodeCanvas value={qrData} size={220} className="border border-gray-400 p-2 shadow-lg" />
                <p className="text-sm text-gray-500 mt-2">🔄 QR updates every 10 seconds</p>
            </div>
            <br>
            </br>
            <br></br> 
            <br>
            </br>
            <br></br>

            {/* Floating Footer */}
            <footer className="absolute bottom-6 text-sm text-gray-300">
                &copy; 2025 QR Attendance System | All Rights Reserved
            </footer>
        </div>
    );
}
