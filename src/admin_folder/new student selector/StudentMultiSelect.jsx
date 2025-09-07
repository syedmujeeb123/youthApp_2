import { useEffect, useState } from "react";
import { db } from "../../context/Me_Firebase";
import { collection, getDocs } from "firebase/firestore";

const StudentMultiSelect = ({ onSelectionChange }) => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      setStudents(list);
    };
    fetchStudents();
  }, []);

  const handleSelect = (uid) => {
    const isSelected = selected.includes(uid);
    const updated = isSelected ? selected.filter(id => id !== uid) : [...selected, uid];
    setSelected(updated);
    onSelectionChange(updated);
  };

  return (
    <div className="mb-4 p-3 bg-white rounded shadow">
      <h3 className="font-semibold mb-2 text-lg">🎯 Select Students to Compare:</h3>
      <div className="flex flex-wrap gap-3">
        {students.map((s) => (
          <button
            key={s.uid}
            className={`px-4 py-2 border rounded-full text-sm ${
              selected.includes(s.uid) ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleSelect(s.uid)}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentMultiSelect;
