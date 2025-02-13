"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import CryptoJS from "crypto-js";

export default function LandingPage() {
    const [currentTime, setCurrentTime] = useState("");
    const [qrData, setQrData] = useState("");
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");

    // Function to get current location
    const fetchLocation = () => {
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
    };

    // Function to generate encrypted QR data
    const generateQrData = () => {
        if (!location) return;
        const timestamp = new Date().toISOString();
        const qrPayload = { timestamp, lat: location.lat, lng: location.lng };

        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(qrPayload), "secret-key").toString();
        setQrData(encryptedData);
    };

    // Fetch location on mount
    useEffect(() => {
        fetchLocation();
    }, []);

    // Update QR code whenever location changes
    useEffect(() => {
        if (location) {
            generateQrData();
            const qrInterval = setInterval(generateQrData, 10000);
            return () => clearInterval(qrInterval);
        }
    }, [location]);

    // Update time every second (client-side only)
    useEffect(() => {
        const updateClock = () => setCurrentTime(new Date().toLocaleTimeString());
        updateClock();
        const clockInterval = setInterval(updateClock, 1000);
        return () => clearInterval(clockInterval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black relative overflow-hidden">
            {/* Background Gradient & Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-500 to-indigo-600 opacity-60 blur-2xl"></div>

            {/* Logo & Title */}
            <div className="relative flex flex-col items-center z-10">
                <h1 className="text-5xl font-extrabold text-white mt-4">QR Attendance System</h1>
                <p className="text-lg text-gray-300 mt-2">Secure & Fast Attendance Marking</p>
            </div>

            {/* Live Clock */}
            {currentTime && (
                <div className="relative mt-6 text-2xl font-bold text-white px-6 py-3 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-xl backdrop-blur-lg border border-gray-500 animate-glow">
                    🕒 {currentTime}
                </div>
            )}

            {/* QR Code Box */}
            <div className="relative mt-8 bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-300 backdrop-blur-md">
                <p className="text-gray-700 font-semibold mb-2">Scan to Mark Attendance</p>
                {qrData ? (
                    <QRCodeCanvas value={qrData} size={220} className="border border-gray-400 p-2 shadow-lg" />
                ) : (
                    <p className="text-red-500 mt-4">Fetching location...</p>
                )}
                <p className="text-sm text-gray-500 mt-2">🔄 QR updates every 10 seconds</p>
            </div>

            {/* Location Error Message */}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Footer */}
            <footer className="absolute bottom-6 text-sm text-gray-300">
                &copy; 2025 QR Attendance System | All Rights Reserved
            </footer>
        </div>
    );
}
