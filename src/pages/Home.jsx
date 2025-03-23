import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
      <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Attendance System</h1>
        <p className="text-lg mb-6">Manage student attendance easily and efficiently.</p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/students")}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-md"
          >
            View Students
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
