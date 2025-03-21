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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const studentsData = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const handleDelete = async (rollNo) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteDoc(doc(db, "students", rollNo));
      setStudents(students.filter((student) => student.rollNo !== rollNo));
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Manage Students</h1>
          <div className="flex justify-end mb-4">
            <Link href="/admin/students/add">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-full text-lg font-semibold hover:scale-105 transition transform">
                ➕ Add Student
              </button>
            </Link>
          </div>
          {loading ? (
            <p className="text-center text-gray-500">Loading students...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border border-gray-300 p-3">Roll Number</th>
                    <th className="border border-gray-300 p-3">Name</th>
                    <th className="border border-gray-300 p-3">Date of Birth</th>
                    <th className="border border-gray-300 p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student.id} className="text-center bg-white hover:bg-gray-100">
                        <td className="border border-gray-300 p-3">{student.rollNo}</td>
                        <td className="border border-gray-300 p-3">{student.name}</td>
                        <td className="border border-gray-300 p-3">{student.dob}</td>
                        <td className="border border-gray-300 p-3">
                          <Link href={`/admin/students/edit/${student.rollNo}`}>
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded mx-1 hover:scale-105 transition">✏ Edit</button>
                          </Link>
                          <button
                            onClick={() => handleDelete(student.rollNo)}
                            className="bg-red-500 text-white px-3 py-1 rounded mx-1 hover:scale-105 transition"
                          >
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-gray-600 text-center">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div> 
  );
}