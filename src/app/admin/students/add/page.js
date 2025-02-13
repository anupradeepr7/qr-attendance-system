"use client";
import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function AddStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [department, setDepartment] = useState("");
  const [admissionYear, setAdmissionYear] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [currentYear, setCurrentYear] = useState("");

  const router = useRouter();

  // Function to determine the student's current year of study
  const calculateCurrentYear = () => {
    if (admissionYear) {
      const currentYear = new Date().getFullYear();
      const yearDifference = currentYear - parseInt(admissionYear);
      
      if (yearDifference === 0) setCurrentYear("1st Year");
      else if (yearDifference === 1) setCurrentYear("2nd Year");
      else if (yearDifference === 2) setCurrentYear("3rd Year");
      else if (yearDifference >= 3) setCurrentYear("4th Year");
      else setCurrentYear(""); // Invalid year case
    }
  };

  // Function to generate Roll Number (YYDepartmentXXX)
  const generateRollNo = () => {
    if (admissionYear && department) {
      const shortYear = admissionYear.slice(2, 4); // Get last two digits of the admission year
      const randomNum = Math.floor(100 + Math.random() * 900); // Generate a 3-digit random number
      setRollNo(`${shortYear}${department}${randomNum}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      name,
      email,
      dob,
      department,
      admissionYear,
      currentYear,
      rollNo,
    };

    // Store student data in Firestore using email as document ID
    await setDoc(doc(db, "students", email), studentData);

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
            <div>
              <label className="block">Department</label>
              <input type="text" className="w-full p-2 border rounded" value={department} onChange={(e) => setDepartment(e.target.value)} required />
            </div>
            <div>
              <label className="block">Admission Year</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={admissionYear}
                onChange={(e) => setAdmissionYear(e.target.value)}
                required
                onBlur={() => {
                  generateRollNo();
                  calculateCurrentYear();
                }}
              />
            </div>
            <div>
              <label className="block">Current Year</label>
              <input type="text" className="w-full p-2 border rounded bg-gray-100" value={currentYear} readOnly required />
            </div>
            <div>
              <label className="block">Roll Number</label>
              <input type="text" className="w-full p-2 border rounded bg-gray-100" value={rollNo} readOnly required />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}
