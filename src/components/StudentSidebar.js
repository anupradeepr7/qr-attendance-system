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
          <li className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
