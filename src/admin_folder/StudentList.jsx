import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../context/Me_Firebase";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const studentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(studentsData);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="text-center text-blue-600">Loading students...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (students.length === 0) {
    return <div className="text-center text-gray-500">No students found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">👨‍🎓 Registered Students</h2>
      <div className="grid grid-cols-1 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white shadow p-4 rounded-lg border border-gray-100">
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>UID:</strong> {student.uid}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
