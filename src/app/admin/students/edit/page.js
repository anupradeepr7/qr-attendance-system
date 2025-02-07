"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function EditStudent() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        fetchStudent();
      }
    });

    return () => checkAuth();
  }, []);

  const fetchStudent = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, "students", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setName(docSnap.data().name);
        setEmail(docSnap.data().email);
      } else {
        alert("Student not found");
        router.push("/admin/students");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const docRef = doc(db, "students", id);
      await updateDoc(docRef, { name, email });
      alert("Student updated successfully!");
      router.push("/admin/students");
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student.");
    }
    setLoading(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Student</h1>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full p-2 rounded text-white ${loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"}`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Student"}
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}
