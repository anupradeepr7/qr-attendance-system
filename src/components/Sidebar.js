import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-6">
      <h2 className="text-lg font-bold">Admin Menu</h2>
      <nav className="mt-4">
        <ul>
          <li className="mb-2">
            <Link href="/admin/dashboard">
              <span className="block px-4 py-2 hover:bg-gray-700 rounded">🏠 Dashboard</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/admin/students">
              <span className="block px-4 py-2 hover:bg-gray-700 rounded">📚 Manage Students</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/logout">
              <span className="block px-4 py-2 bg-red-600 rounded">🚪 Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
