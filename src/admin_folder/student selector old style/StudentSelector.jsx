// import { useState, useEffect } from "react";
// import { useFirebase } from "../context/Me_Firebase";

// const StudentSelector = ({ onSelect }) => {
//   const { getAllUsers } = useFirebase();
//   const [students, setStudents] = useState([]);
//   const [selectedId, setSelectedId] = useState("");

//   useEffect(() => {
//     const fetchStudents = async () => {
//       const allUsers = await getAllUsers();
//       setStudents(allUsers);
//     };
//     fetchStudents();
//   }, [getAllUsers]);

//   const handleChange = (e) => {
//     const uid = e.target.value;
//     setSelectedId(uid);
//     const student = students.find((s) => s.uid === uid);
//     onSelect(student);
//   };

//   return (
//     <div className="mb-6">
//       <label className="block text-gray-700 font-semibold mb-2">
//         Select a Student
//       </label>
//       <select
//         value={selectedId}
//         onChange={handleChange}
//         className="w-full p-2 border rounded-md bg-white shadow"
//       >
//         <option value="">-- Choose a student --</option>
//         {students.map((student) => (
//           <option key={student.uid} value={student.uid}>
//             {student.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default StudentSelector;
