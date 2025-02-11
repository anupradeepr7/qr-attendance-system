"use client";
import Link from "next/link";

export default function StudentSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/student/dashboard">
              <span className="block p-2 hover:bg-gray-700 rounded">📊 Dashboard</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/student/attendance">
              <span className="block p-2 hover:bg-gray-700 rounded">📅 My Attendance</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
