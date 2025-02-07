"use client";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("adminToken");
    router.push("/admin");
  };

  return (
    <header className="flex justify-between bg-white p-4 shadow-md rounded-lg">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </header>
  );
}
