"use client";
import { useState, useEffect } from "react";
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
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Active");
  const [rollNo, setRollNo] = useState("");

  const router = useRouter();

  // Function to generate roll number
  useEffect(() => {
    if (year && department) {
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const deptCode = department.slice(0, 3).toUpperCase();
      const randomNum = Math.floor(100 + Math.random() * 900); // Random 3-digit number
      setRollNo(`${currentYear}${deptCode}${randomNum}`);
    }
  }, [year, department]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      email, // Store email inside the document
      rollNo,
      name,
      gender,
      dob,
      department,
      year,
      section,
      address,
      status,
    };

    await setDoc(doc(db, "students", email), studentData);
    router.push("/admin/students");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-center">Add Student</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
            {/* Left Column */}
            <div>
              <label className="block">Name</label>
              <input type="text" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />

              <label className="block mt-4">Email</label>
              <input type="email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <label className="block mt-4">Date of Birth</label>
              <input type="date" className="w-full p-2 border rounded" value={dob} onChange={(e) => setDob(e.target.value)} required />

              <label className="block mt-4">Gender</label>
              <select className="w-full p-2 border rounded" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            {/* Right Column */}
            <div>
              <label className="block">Department</label>
              <select className="w-full p-2 border rounded" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                <option value="">Select Department</option>
                <option value="Msccs">M.Sc Computer Science</option>
                <option value="Btech">B.Tech</option>
                <option value="Bscit">B.Sc IT</option>
              </select>

              <label className="block mt-4">Year</label>
              <select className="w-full p-2 border rounded" value={year} onChange={(e) => setYear(e.target.value)} required>
                <option value="">Select Year</option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
              </select>

              <label className="block mt-4">Section</label>
              <select className="w-full p-2 border rounded" value={section} onChange={(e) => setSection(e.target.value)} required>
                <option value="-">-</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>

              <label className="block mt-4">Roll No</label>
              <input type="text" className="w-full p-2 border rounded bg-gray-100" value={rollNo} readOnly />

              <label className="block mt-4">Address</label>
              <textarea className="w-full p-2 border rounded" value={address} onChange={(e) => setAddress(e.target.value)} required />

              <label className="block mt-4">Status</label>
              <select className="w-full p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Submit Button (Full Width) */}
            <div className="col-span-2 text-center">
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">Save</button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}
