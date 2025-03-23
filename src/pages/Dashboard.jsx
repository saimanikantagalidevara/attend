import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [newStudentName, setNewStudentName] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsCollection = await getDocs(collection(db, "students"));
      const studentsData = studentsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(studentsData);
    };
    fetchStudents();
  }, []);

  const toggleAttendance = async (id) => {
    setStudents((prevStudents) => prevStudents.map((student) => student.id === id ? { ...student, present: !student.present } : student));
  };

  const saveAttendance = async () => {
    setLoading(true);
    try {
      for (let student of students) {
        const attendanceQuery = query(collection(db, "attendance"), where("studentId", "==", student.id), where("date", "==", selectedDate));
        const existingAttendance = await getDocs(attendanceQuery);
        if (!existingAttendance.empty) continue;
        await addDoc(collection(db, "attendance"), { studentId: student.id, name: student.name, date: selectedDate, present: student.present });
      }
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
    setLoading(false);
  };

  const addStudent = async () => {
    if (!newStudentName.trim()) {
      alert("Student name cannot be empty!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "students"), { name: newStudentName, present: false });
      setStudents([...students, { id: docRef.id, name: newStudentName, present: false }]);
      setNewStudentName("");
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const saveEditedName = async (id) => {
    if (!editedName.trim()) return;
    try {
      await updateDoc(doc(db, "students", id), { name: editedName });
      setStudents((prev) => prev.map((student) => student.id === id ? { ...student, name: editedName } : student));
      setEditingId(null);
      setEditedName("");
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteDoc(doc(db, "students", id));
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col items-center py-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <button onClick={() => navigate("/")} className="w-11/12 py-3 text-lg bg-blue-500 hover:bg-blue-700 transition-all rounded-md mb-4">
          Home
        </button>
        <button className="w-11/12 py-3 text-lg bg-gray-500 hover:bg-gray-700 transition-all rounded-md">
          Dashboard
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-8 py-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Attendance Dashboard</h1>

        {/* Add Student */}
        <div className="flex items-center gap-4 w-full max-w-lg mb-6">
          <input
            type="text"
            placeholder="Enter student name"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            className="border border-gray-400 p-2 rounded-md flex-1"
          />
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all" onClick={addStudent}>
            Add
          </button>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="mr-2 text-lg font-semibold">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-400 p-2 rounded-md"
          />
        </div>

        {/* Students List */}
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
          <ul>
            {students.map((student) => (
              <li key={student.id} className="flex justify-between items-center p-3 border-b border-gray-300">
                <div className="flex-1 min-w-0">
                  {editingId === student.id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="border p-1 rounded-md w-full"
                      onBlur={() => saveEditedName(student.id)}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="text-lg truncate block max-w-[150px] cursor-pointer hover:underline"
                      onClick={() => {
                        setEditingId(student.id);
                        setEditedName(student.name);
                      }}
                    >
                      {student.name}
                    </span>
                  )}
                </div>
                <button
                  className={`px-4 py-2 rounded-lg text-white ${student.present ? "bg-green-500" : "bg-red-500"} hover:opacity-80 transition-all`}
                  onClick={() => toggleAttendance(student.id)}
                >
                  {student.present ? "Present" : "Absent"}
                </button>
                <button
                  className="ml-3 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-800 transition-all"
                  onClick={() => deleteStudent(student.id)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Save Attendance Button */}
        <button
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all"
          onClick={saveAttendance}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Attendance"}
        </button>
      </main>
    </div>
  );
}

export default Dashboard;
