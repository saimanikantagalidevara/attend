import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = await getDocs(collection(db, "students"));
        const studentsData = studentsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const fetchAttendanceHistory = async (studentId) => {
    try {
      const attendanceQuery = query(
        collection(db, "attendance"),
        where("studentId", "==", studentId)
      );
      const attendanceDocs = await getDocs(attendanceQuery);
      const history = {};

      attendanceDocs.forEach((doc) => {
        const data = doc.data();
        history[data.date] = data.present;
      });

      setAttendanceHistory(history);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    }
  };

  const handleViewHistory = (student) => {
    setSelectedStudent(student);
    fetchAttendanceHistory(student.id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col items-center py-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <button onClick={() => navigate("/")} className="w-11/12 py-3 text-lg bg-blue-500 hover:bg-blue-700 transition-all rounded-md mb-4">
          Home
        </button>
        <button onClick={() => navigate("/dashboard")} className="w-11/12 py-3 text-lg bg-gray-500 hover:bg-gray-700 transition-all rounded-md">
          Dashboard
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-8 py-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Students</h1>

        {/* Student List */}
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
          <ul className="space-y-4">
            {students.map((student) => (
              <li key={student.id} className="flex justify-between items-center p-3 border-b border-gray-300 rounded-md shadow-md">
                <span className="text-lg font-semibold truncate max-w-[200px]">{student.name}</span>
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all"
                  onClick={() => handleViewHistory(student)}
                >
                  View History
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Attendance History Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{selectedStudent.name}'s Attendance</h2>
            <ul className="overflow-y-auto max-h-60">
              {Object.keys(attendanceHistory).length > 0 ? (
                Object.entries(attendanceHistory).map(([date, present]) => (
                  <li key={date} className="flex justify-between border-b py-2">
                    <span>{date}</span>
                    <span className={`font-semibold ${present ? "text-green-500" : "text-red-500"}`}>
                      {present ? "Present" : "Absent"}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">No attendance history available.</p>
              )}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg w-full hover:bg-red-700 transition-all"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
