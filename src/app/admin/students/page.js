"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import AdminProtected from "@/components/AdminProtected";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function StudentsList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const studentsData = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteDoc(doc(db, "students", id));
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  return (
    <AdminProtected>
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Manage Students</h1>
          <Link href="/admin/students/add">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">➕ Add Student</button>
          </Link>
          <table className="w-full mt-6 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Date of Birth</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="text-center bg-white hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{student.name}</td>
                  <td className="border border-gray-300 p-2">{student.email}</td>
                  <td className="border border-gray-300 p-2">{student.dob}</td>
                  <td className="border border-gray-300 p-2">
                    <Link href={`/admin/students/edit/${student.id}`}>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded mx-1">✏ Edit</button>
                    </Link>
                    <button onClick={() => handleDelete(student.id)} className="bg-red-500 text-white px-3 py-1 rounded mx-1">
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan="4" className="p-4 text-gray-600">No students found.</td></tr>}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
    </div>
    </AdminProtected>
  );
}
