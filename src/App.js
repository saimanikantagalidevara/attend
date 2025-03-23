import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import { db } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsCollection = collection(db, "students");
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentsList = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsList);
    };
    fetchStudents();
  }, []);

  const toggleAttendance = async (id, present) => {
    const studentRef = doc(db, "students", id);
    await updateDoc(studentRef, { present: !present });
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, present: !present } : student
      )
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home students={students} toggleAttendance={toggleAttendance} />} />
        <Route path="/dashboard" element={<Dashboard students={students} />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </Router>
  );
}

export default App;
