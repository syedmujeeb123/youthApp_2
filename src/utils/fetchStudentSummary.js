// src/utils/fetchStudentSummaryByRange.js
import { getDoc, doc } from "firebase/firestore";
import { db } from "../context/Me_Firebase";

// Format keys and display dates
const formatDateKey = (date) => date.toLocaleDateString("en-CA");
const formatDisplayDate = (date) =>
  date.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export const fetchStudentSummaryByRange = async (uid, start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const result = [];

  const cache = new Map(); // 🔒 cache per date

  const loopDate = new Date(startDate);
  while (loopDate <= endDate) {
    const dateKey = formatDateKey(loopDate);
    const displayDate = formatDisplayDate(loopDate);

    // 🔍 Check if already fetched
    let docSnap;
    if (cache.has(dateKey)) {
      docSnap = cache.get(dateKey);
    } else {
      try {
        docSnap = await getDoc(doc(db, "dailyRecords", dateKey));
        cache.set(dateKey, docSnap); // ✅ Save for future
      } catch (error) {
        console.error("Fetch error:", dateKey, error);
        result.push({ date: displayDate, submitted: false });
        loopDate.setDate(loopDate.getDate() + 1);
        continue;
      }
    }

    const studentData = docSnap.exists() ? docSnap.data()?.students?.[uid] : null;

    if (studentData?.submitted) {
      result.push({
        date: displayDate,
        submitted: true,
        formData: studentData.formData || {},
        submittedAt: studentData.submittedAt?.toDate()?.toLocaleTimeString() || "-",
      });
    } else {
      result.push({ date: displayDate, submitted: false });
    }

    loopDate.setDate(loopDate.getDate() + 1);
  }

  return result;
};
























// working code
//  _________________________________________________________________________________________________


// import { getDoc, doc } from "firebase/firestore";
// import { db } from "../context/Me_Firebase";

// // Utility to format dates like "2024-07-16"
// const formatDateKey = (date) => date.toLocaleDateString("en-CA");
// const formatDisplayDate = (date) =>
//   date.toLocaleDateString("en-IN", {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//   });

// export const fetchStudentSummaryByRange = async (uid, start, end) => {
//   const startDate = new Date(start);
//   const endDate = new Date(end);
//   const result = [];

//   const loopDate = new Date(startDate);
//   while (loopDate <= endDate) {
//     const dateKey = formatDateKey(loopDate);
//     const displayDate = formatDisplayDate(loopDate);

//     try {
//       const docSnap = await getDoc(doc(db, "dailyRecords", dateKey));
//       const studentData = docSnap.exists()
//         ? docSnap.data()?.students?.[uid]
//         : null;

//       if (studentData?.submitted) {
//         result.push({
//           date: displayDate,
//           submitted: true,
//           formData: studentData.formData || {},
//           submittedAt: studentData.submittedAt?.toDate()?.toLocaleTimeString() || "-",
//         });
//       } else {
//         result.push({ date: displayDate, submitted: false });
//       }
//     } catch (error) {
//       console.error("Error fetching summary for date:", dateKey, error);
//     }

//     loopDate.setDate(loopDate.getDate() + 1);
//   }

//   return result;
// };
