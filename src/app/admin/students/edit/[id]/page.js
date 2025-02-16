"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function EditStudent() {
  const router = useRouter();
  const { id } = useParams(); // Get Roll Number from URL

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState(""); // Firestore Doc ID

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

  // Fetch student by Roll Number
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const q = query(collection(db, "students"), where("rollNo", "==", id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("⚠️ Student Not Found!");
          setLoading(false);
          return;
        }

        querySnapshot.forEach((docSnap) => {
          const studentData = docSnap.data();
          setStudentId(docSnap.id); // Firestore Document ID
          setName(studentData.name);
          setEmail(studentData.email);
          setDob(studentData.dob);
          setGender(studentData.gender);
          setDepartment(studentData.department);
          setYear(studentData.year);
          setSection(studentData.section);
          setAddress(studentData.address);
          setStatus(studentData.status);
          setRollNo(studentData.rollNo);
        });
      } catch (err) {
        console.error("Error fetching student:", err);
        setError("❌ Failed to load student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      name,
      dob,
      gender,
      department,
      year,
      section,
      address,
      status,
    };

    try {
      await updateDoc(doc(db, "students", studentId), updatedData);
      alert("✅ Student updated successfully!");
      router.push("/admin/students");
    } catch (err) {
      console.error("Error updating student:", err);
      setError("❌ Failed to update student. Try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading student details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-center">Edit Student</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
            {/* Left Column */}
            <div>
              <label className="block">Name</label>
              <input type="text" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />

              <label className="block mt-4">Email</label>
              <input type="email" className="w-full p-2 border rounded bg-gray-100" value={email} readOnly />

              <label className="block mt-4">Date of Birth</label>
              <input type="date" className="w-full p-2 border rounded" value={dob} onChange={(e) => setDob(e.target.value)} required />

              <label className="block mt-4">Gender</label>
              <select className="w-full p-2 border rounded" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            {/* Right Column */}
            <div>
              <label className="block">Department</label>
              <select className="w-full p-2 border rounded" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                <option value="Msccs">M.Sc Computer Science</option>
                <option value="Btech">B.Tech</option>
                <option value="Bscit">B.Sc IT</option>
              </select>

              <label className="block mt-4">Year</label>
              <select className="w-full p-2 border rounded" value={year} onChange={(e) => setYear(e.target.value)} required>
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
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">Update</button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}
