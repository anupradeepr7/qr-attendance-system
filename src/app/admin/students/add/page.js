"use client";
import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function AddStudent() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Active");
  const [rollNo, setRollNo] = useState("");

  const router = useRouter();

  useEffect(() => {
    const generateRollNo = async () => {
      if (!year || !department) return;
  
      const admissionYear = new Date().getFullYear().toString().slice(-2); // Extracts last two digits (e.g., "25" for 2025)
      const ugOrPg = department.includes("M") ? "02" : "01"; // PG = 02, UG = 01
      const deptCode = {
        "BSc CS": "101",
        "BA English": "102",
        "BBA": "103",
        "BCom": "104",
        "MSc CS": "201",
        "MCA": "202",
        "MBA": "203",
      }[department] || "999"; // Default code for unknown dept
  
      // Query only the last student from the same department
      const studentsRef = collection(db, "students");
      const q = query(
        studentsRef,
        where("department", "==", department), // Filter by same department
        orderBy("rollNo", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      let serialNumber = "001";
  
      if (!snapshot.empty) {
        const lastRollNo = snapshot.docs[0].data().rollNo;
        const lastSerial = parseInt(lastRollNo.slice(-3));
        serialNumber = String(lastSerial + 1).padStart(3, "0");
      }
  
      setRollNo(`${admissionYear}${ugOrPg}${deptCode}${serialNumber}`);
    };
  
    generateRollNo();
  }, [year, department]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rollNo) return alert("Roll number generation failed!");

    const studentData = {
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

    await setDoc(doc(db, "students", rollNo), studentData);
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
            <div>
              <label className="block">Name</label>
              <input type="text" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />

              <label className="block mt-4">Date of Birth</label>
              <input type="date" className="w-full p-2 border rounded" value={dob} onChange={(e) => setDob(e.target.value)} required />

              <label className="block mt-4">Gender</label>
              <select className="w-full p-2 border rounded" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label className="block">Department</label>
              <select className="w-full p-2 border rounded" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                <option value="">Select Department</option>
                <option value="BSc CS">B.Sc Computer Science</option>
                <option value="BA English">BA English</option>
                <option value="BBA">BBA</option>
                <option value="BCom">B.Com</option>
                <option value="MSc CS">M.Sc Computer Science</option>
                <option value="MCA">MCA</option>
                <option value="MBA">MBA</option>
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
