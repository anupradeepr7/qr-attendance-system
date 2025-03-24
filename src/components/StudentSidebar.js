"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StudentSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("student");
    router.push("/student/login");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 shadow-lg">
      <div className="p-6 text-center border-b border-gray-700">
        <h2 className="text-lg font-bold">🎓 Student Portal</h2>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link href="/student/dashboard">
              <span className="block p-3 hover:bg-gray-800 rounded transition">
                📊 Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link href="/student/attendance-history">
              <span className="block p-3 hover:bg-gray-800 rounded transition">
                📅 Attendance History
              </span>
            </Link>
          </li>
          <li>
            <Link href="#">
              <span className="block p-3 hover:bg-gray-800 rounded transition">
                👤 My Profile
              </span>
            </Link>
          </li>
          <li>
            <Link href="#">
              <span className="block p-3 hover:bg-gray-800 rounded transition">
                📖 Timetable
              </span>
            </Link>
          </li>
          <li>
            <Link href="#">
              <span className="block p-3 hover:bg-gray-800 rounded transition">
                📢 Announcements
              </span>
            </Link>
          </li>
          <li className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition"
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
