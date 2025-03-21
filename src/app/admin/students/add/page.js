"use client";
import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

// ✅ Centralized department mapping
const DEPARTMENT_CODES = {
  "B.Sc Computer Science": "101",
  "BA English": "102",
  "BBA": "103",
  "B.Com": "104",
  "M.Sc Computer Science": "201",
  "MCA": "202",
  "MBA": "203",
};

export default function AddStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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

      const admissionYear = new Date().getFullYear().toString().slice(-2);
      const ugOrPg = department.includes("M") ? "02" : "01";
      const deptCode = DEPARTMENT_CODES[department] || "999";

      const studentsRef = collection(db, "students");
      const q = query(studentsRef, where("department", "==", department), orderBy("rollNo", "desc"), limit(1));
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

    const studentData = { rollNo, name, email, phone, gender, dob, department, year, section, address, status };
    await setDoc(doc(db, "students", rollNo), studentData);
    router.push("/admin/students");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar /> {/* ✅ Fixed Sidebar */}
      <div className="flex-1 p-6 ml-64"> {/* ✅ Adds left margin to prevent overlap */}
        <Header />
        <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-lg p-8 rounded-lg shadow-xl border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Add Student</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <Input label="Name" value={name} setValue={setName} />
              <Input label="Email" type="email" value={email} setValue={setEmail} />
              <Input label="Phone Number" type="tel" value={phone} setValue={setPhone} />
              <Input label="Date of Birth" type="date" value={dob} setValue={setDob} />
              <Select label="Gender" value={gender} setValue={setGender} options={{ "": "Select Gender", M: "Male", F: "Female" }} />
            </div>

            {/* Right Column */}
            <div>
              <Select label="Department" value={department} setValue={setDepartment} options={{ "": "Select Department", ...DEPARTMENT_CODES }} />
              <Select label="Year" value={year} setValue={setYear} options={{ "": "Select Year", I: "I", II: "II", III: "III", IV: "IV" }} />
              <Select label="Section" value={section} setValue={setSection} options={{ "-": "-", A: "A", B: "B", C: "C" }} />
              <Input label="Roll No" value={rollNo} readOnly />
              <Textarea label="Address" value={address} setValue={setAddress} />
              <Select label="Status" value={status} setValue={setStatus} options={{ Active: "Active", Inactive: "Inactive" }} />
            </div>

            {/* Submit Button */}
            <div className="col-span-2 flex justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-full text-lg font-semibold hover:scale-105 transition transform">
                Save Student
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}

// 🔥 Reusable Styled Input Component
function Input({ label, type = "text", value, setValue, readOnly = false }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 font-semibold">{label}</label>
      <input
        type={type}
        className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${readOnly ? "bg-gray-200 cursor-not-allowed" : "hover:shadow-md transition"
          }`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        readOnly={readOnly}
        required
      />
    </div>
  );
}

// 🔥 Reusable Styled Select Component
function Select({ label, value, setValue, options }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 font-semibold">{label}</label>
      <select
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 hover:shadow-md transition"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      >
        {Object.entries(options).map(([key, val]) => (
          <option key={key} value={key}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
}

// 🔥 Reusable Styled Textarea Component
function Textarea({ label, value, setValue }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 font-semibold">{label}</label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 hover:shadow-md transition"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
    </div>
  );
}
