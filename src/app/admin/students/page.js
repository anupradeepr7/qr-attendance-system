"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { db } from "../../../lib/firebase";
import Header from "../../../components/AdminHeader";
import Footer from "../../../components/AdminFooter";
import Sidebar from "../../../components/AdminSidebar";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const DEPARTMENT_CODES = {
    "101": "B.Sc Computer Science",
    "102": "BA English",
    "103": "BBA",
    "104": "B.Com",
    "105": "B.Sc Mathematics",
    "106": "B.Sc Physics",
    "107": "B.Sc Chemistry",
    "108": "B.Sc Botany",
    "109": "B.Sc Zoology",
    "110": "BA History",
    "111": "BA Economics",
    "112": "BA Political Science",
    "113": "BA Sociology",
    "114": "B.Com (CA)",
  
    "201": "M.Sc Computer Science",
    "202": "MCA",
    "203": "MBA",
    "204": "M.Sc Mathematics",
    "205": "M.Sc Physics",
    "206": "M.Sc Chemistry",
    "207": "M.Sc Botany",
    "208": "M.Sc Zoology",
    "209": "MA History",
    "210": "MA Economics",
    "211": "MA Political Science",
    "212": "MA Sociology",
    "213": "M.Com",
  };
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, "students");
        const studentsSnapshot = await getDocs(studentsRef);

        if (studentsSnapshot.empty) {
          console.warn("⚠ No students found in Firestore!");
          setStudents([]); // Ensure empty state is handled
        } else {
          console.log("✅ Fetched Students:", studentsSnapshot.docs.map((doc) => doc.data()));
        }

        const studentsData = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentsData);
      } catch (error) {
        console.error("❌ Error fetching students:", error);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteDoc(doc(db, "students", id));
        setStudents(students.filter((student) => student.id !== id));
      } catch (error) {
        console.error("❌ Error deleting student:", error);
      }
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
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : students.length === 0 ? (
            <p className="text-center text-gray-500">No students found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Roll No</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Email</th>
                    <th className="border border-gray-300 px-4 py-2">Phone</th>
                    <th className="border border-gray-300 px-4 py-2">Department</th>
                    <th className="border border-gray-300 px-4 py-2">Year</th>
                    <th className="border border-gray-300 px-4 py-2">Section</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{student.rollNo}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.phone}</td>
                      <td className="border border-gray-300 px-4 py-2">{DEPARTMENT_CODES[student.department]??'-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.year}</td>
                      <td className="border border-gray-300 px-4 py-2">{student.section}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <Link href={`/admin/students/edit/${student.id}`}>
                          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:scale-105 transition">
                            ✏️ Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:scale-105 transition"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
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
