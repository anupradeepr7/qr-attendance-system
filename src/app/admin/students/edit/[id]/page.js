"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";
import Header from "../../../../../components/AdminHeader";
import Footer from "../../../../../components/AdminFooter";
import Sidebar from "../../../../../components/AdminSidebar";

export default function EditStudent() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id: rollNo } = useParams(); // ✅ Get Roll Number from URL

  useEffect(() => {
    if (!rollNo) {
      alert("Invalid student ID!");
      router.push("/admin/students");
      return;
    }

    const fetchStudent = async () => {
      try {
        const studentRef = doc(db, "students", rollNo);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          setStudent(studentSnap.data());
        } else {
          alert("Student not found!");
          router.push("/admin/students");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        alert("Error fetching student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [rollNo]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!student) return alert("Student data is missing!");

    try {
      const studentRef = doc(db, "students", rollNo);
      await updateDoc(studentRef, student);
      alert("Student updated successfully!");
      router.push("/admin/students");
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student!");
    }
  };

  if (loading) return <div>Loading student details...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Edit Student</h1>

          {student && (
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-6">
              <Input label="Name" value={student?.name} setValue={(val) => setStudent({ ...student, name: val })} />
              <Input label="Email" value={student?.email} setValue={(val) => setStudent({ ...student, email: val })} />
              <Input label="Phone Number" value={student?.phone} setValue={(val) => setStudent({ ...student, phone: val })} />
              <Input label="Date of Birth" type="date" value={student?.dob} setValue={(val) => setStudent({ ...student, dob: val })} />
              <Input label="Gender" value={student?.gender} setValue={(val) => setStudent({ ...student, gender: val })} />
              <Input label="Department" value={student?.department} setValue={(val) => setStudent({ ...student, department: val })} />
              <Input label="Year" value={student?.year} setValue={(val) => setStudent({ ...student, year: val })} />
              <Input label="Section" value={student?.section} setValue={(val) => setStudent({ ...student, section: val })} />
              <Input label="Status" value={student?.status} setValue={(val) => setStudent({ ...student, status: val })} />
              <Textarea label="Address" value={student?.address} setValue={(val) => setStudent({ ...student, address: val })} />

              <div className="col-span-2 flex justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-full text-lg font-semibold hover:scale-105 transition transform">
                  Update Student
                </button>
              </div>
            </form>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, setValue }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 font-semibold">{label}</label>
      <input
        type={type}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 hover:shadow-md transition"
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        required
      />
    </div>
  );
}

function Textarea({ label, value, setValue }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 font-semibold">{label}</label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 hover:shadow-md transition"
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        required
      />
    </div>
  );
}
