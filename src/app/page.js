"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import CryptoJS from "crypto-js";

export default function LandingPage() {
    const [currentTime, setCurrentTime] = useState("");
    const [qrData, setQrData] = useState("");
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");
    const [ngrokUrl, setNgrokUrl] = useState("");

    // Fetch location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Location Error:", error);
                    setError("Unable to fetch location. Please enable GPS.");
                },
                { enableHighAccuracy: true }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }

        // Fetch ngrok URL from env or set manually
        setNgrokUrl(process.env.NEXT_PUBLIC_NGROK_URL || "https://example.ngrok-free.app" + "/student/login");
    }, []);

    // Generate QR Data for Attendance
    useEffect(() => {
        if (location) {
            const generateQrData = () => {
                const timestamp = new Date().toISOString();
                const qrPayload = { timestamp, lat: location.lat, lng: location.lng };
                const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(qrPayload), "secret-key").toString();
                setQrData(encryptedData);
            };
            generateQrData();
            const interval = setInterval(generateQrData, 10000);
            return () => clearInterval(interval);
        }
    }, [location]);

    // Update current time every second
    useEffect(() => {
        const updateClock = () => setCurrentTime(new Date().toLocaleTimeString());
        updateClock();
        const clockInterval = setInterval(updateClock, 1000);
        return () => clearInterval(clockInterval);
    }, []);

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-black px-6">
            {/* LEFT SECTION: Main QR Code */}
            <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-2xl border border-gray-300">
                <h1 className="text-4xl font-extrabold text-blue-600">QR Attendance System</h1>
                <p className="text-gray-600 mt-2">Secure & Fast Attendance Marking</p>

                {/* Live Clock */}
                {currentTime && (
                    <div className="mt-4 text-xl font-bold bg-gray-800 text-white px-6 py-2 rounded-lg shadow-md">
                        🕒 {currentTime}
                    </div>
                )}

                {/* QR Code for Attendance */}
                <div className="mt-6 bg-white p-6 rounded-xl border shadow-lg">
                    <p className="text-gray-700 font-semibold text-center">Scan to Mark Attendance</p>
                    {qrData ? (
                        <QRCodeCanvas value={qrData} size={220} className="border border-gray-400 p-2 shadow-md" />
                    ) : (
                        <p className="text-red-500 mt-4">Fetching location...</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2 text-center">🔄 QR updates every 10 seconds</p>
                </div>

                {/* Location Error */}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            {/* RIGHT SECTION: ngrok QR Code & URL */}
            <div className="mt-8 lg:mt-0 lg:ml-12 bg-white p-6 rounded-2xl shadow-xl border border-gray-300 text-center">
                <h2 className="text-xl font-bold text-blue-500">Remote Access</h2>
                <p className="text-gray-600">Scan to Open System</p>

                {/* QR Code for ngrok URL */}
                {ngrokUrl ? (
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                        <QRCodeCanvas value={ngrokUrl} size={120} className="border border-gray-400 p-2 shadow-md" />
                        <p className="mt-2 text-sm text-gray-600">🔗 <a href={ngrokUrl} target="_blank" className="text-blue-500 underline">{ngrokUrl}</a></p>
                    </div>
                ) : (
                    <p className="text-red-500 mt-4">ngrok URL not available</p>
                )}
            </div>
        </div>
    );
}
