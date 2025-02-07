"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function AddStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "students"), { name, email, dob });
    router.push("/admin/students");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Add Student</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">Name</label>
              <input type="text" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block">Email</label>
              <input type="email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block">Date of Birth</label>
              <input type="date" className="w-full p-2 border rounded" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}
