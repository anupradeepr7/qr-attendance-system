"use client";
import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useRouter } from "next/navigation";
import Header from "../../../../components/AdminHeader";
import Footer from "../../../../components/AdminFooter";
import Sidebar from "../../../../components/AdminSidebar";

// ✅ Centralized department mapping

// Department Mapping
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

export default function AddStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("-");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Active");
  const [rollNo, setRollNo] = useState("");

  const router = useRouter();

  useEffect(() => {
    const generateRollNo = async () => {
      if (!year || !department) return;

      const admissionYear = new Date().getFullYear().toString().slice(-2);
      const deptCode = department; // department is already the correct numeric code

      const studentsRef = collection(db, "students");
      const q = query(
        studentsRef,
        where("department", "==", DEPARTMENT_CODES[department]),
        orderBy("rollNo", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      let serialNumber = "001";

      if (!snapshot.empty) {
        const lastRollNo = snapshot.docs[0].data().rollNo;
        const lastSerial = parseInt(lastRollNo.slice(-3), 10);
        serialNumber = String(lastSerial + 1).padStart(3, "0");
      }

      setRollNo(`${admissionYear}${deptCode}${serialNumber}`);
    };

    generateRollNo();
  }, [year, department]);


  const validateInputs = () => {
    if (!name || !email || !phone || !dob || !gender || !department || !year || !address) {
      alert("Please fill all required fields!");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be 10 digits!");
      return false;
    }
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 17) {
      alert("Student must be at least 17 years old!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rollNo) return alert("Roll number generation failed!");
    if (!validateInputs()) return;

    const studentData = { rollNo, name, email, phone, gender, dob, department, year, section, address, status };

    try {
      await setDoc(doc(db, "students", rollNo), studentData);
      alert("Student added successfully!");
      router.push("/admin/students");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student. Please try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Add Student</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <Input label="Name" value={name} setValue={setName} />
              <Input label="Email" type="email" value={email} setValue={setEmail} />
              <Input label="Phone Number" type="tel" value={phone} setValue={setPhone} maxLength={10} />
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
function Input({ label, type = "text", value, setValue, readOnly = false, maxLength }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 font-semibold">{label}</label>
      <input
        type={type}
        className={`w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${readOnly ? "bg-gray-200 cursor-not-allowed" : "hover:shadow-md transition"}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        readOnly={readOnly}
        maxLength={maxLength}
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
