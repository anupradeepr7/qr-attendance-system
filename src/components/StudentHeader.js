"use client";
export default function StudentHeader({ onLogout }) {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">Student Dashboard</h1>
      <button onClick={onLogout} className="bg-red-500 px-4 py-2 rounded">
        Logout
      </button>
    </header>
  );
}
