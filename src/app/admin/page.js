"use client";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import Header from "../../components/AdminHeader";
import Footer from "../../components/AdminFooter";
import Sidebar from "../../components/AdminSidebar";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const snapshot = await getDocs(collection(db, "students"));
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      await deleteDoc(doc(db, "students", id));
      setStudents(students.filter(student => student.id !== id));
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold">Manage Students</h1>
          <Link href="/admin/students/add" className="bg-green-500 text-white p-2">Add Student</Link>
          <ul className="mt-4">
            {students.map(student => (
              <li key={student.id} className="border p-2 flex justify-between">
                {student.name} - {student.email}
                <div>
                  <Link href={`/admin/students/edit?id=${student.id}`} className="bg-yellow-500 text-white p-1">Edit</Link>
                  <button onClick={() => handleDelete(student.id)} className="ml-2 bg-red-500 text-white p-1">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </main>
        <Footer />
      </div>
    </div>
  );
}
