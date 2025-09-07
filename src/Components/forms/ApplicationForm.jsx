import { useEffect, useState } from "react";
import { useFirebase } from "../../context/Me_Firebase";
import InputField from "../UI/reusable/InputField";
import BackButton from "../UI/reusable/BackTo";
import Show_username from "../UI/reusable/Show_username";
import { Link } from "react-router-dom";
import { initial_formdata,formLabels } from "../../constants/formFields";

const LOCAL_STORAGE_KEY = "applicationFormData";

function ApplicationForm() {
  const { user, submitDailyForm, getUsernameByUID } = useFirebase();

  const initialFormData = initial_formdata
  

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [invalidFields, setInvalidFields] = useState(new Set());

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    const fieldType = dataset.type;
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [fieldType]: value,
      },
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");
  setSubmitSuccess(false);

  // 🔍 Debug: Check user authentication
  console.log("🔍 Debug - User:", user);
  console.log("🔍 Debug - User UID:", user?.uid);
  console.log("🔍 Debug - Is authenticated:", !!user);

  if (!user || !user.uid) {
    setErrorMsg("❌ You must be logged in to submit the form.");
    return;
  }

  const newInvalidFields = new Set();
  Object.entries(formData).forEach(([key, field]) => {
    if (!field.value.trim()) newInvalidFields.add(key);
  });

  if (newInvalidFields.size > 0) {
    setInvalidFields(newInvalidFields);
    setErrorMsg("⚠️ Please fill all the items before submitting.");
    setTimeout(() => setErrorMsg(""), 3000);
    return;
  }

  setInvalidFields(new Set());
  setLoading(true);

  try {
    const username = await getUsernameByUID(user.uid);
    console.log("🔍 Debug - Username:", username);
    const result = await submitDailyForm(user.uid, username, formData);

    if (!result.success) {
      setErrorMsg(result.message || "❌ You have already submitted today's form.");
      setLoading(false);
      return;
    }

    console.log("Form Submitted", formData);



    setLoading(false);
    setSubmitSuccess(true);
    setFormData(initialFormData);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setTimeout(() => setSubmitSuccess(false), 3000);


  } catch (err) {
    setErrorMsg("❌ Error submitting form. Please try again.");
    console.error(err.message);
  } finally {
    setLoading(false);
  }
};


  const calculateCompletionPercentage = () => {
    const total = Object.keys(formData).length;
    const filled = Object.values(formData).filter(f => f.value.trim()).length;
    return Math.round((filled / total) * 100);
  };

  const fields = formLabels

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-indigo-200 py-6 px-4">












      {/* <div className="flex justify-between align items-center mb-4">
        <BackButton label="Go Back" />
        <div className="flex  ">
        <span className="text-md font-medium text-gray-700">
          Welcome, <Show_username />
        </span>
        <div>
          <Link to="/student/summary" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
             📊 View My Summary
                  </Link>
        </div>

        </div>
      </div> */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
  <BackButton label="Go Back" />

  <div className="flex flex-col md:flex-row md:items-center gap-2">
    <span className="text-md font-medium text-gray-700">
      Welcome, <Show_username />
    </span>

    <Link
      to="/student/summary"
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm text-center"
    >
      📊 View My Summary
    </Link>
  </div>
</div>














      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-1">🌟 Daily Accountability Tracker</h2>
          <p className="text-sm">Track your daily habits and spiritual practices</p>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 border border-blue-200 px-5 py-2 rounded-full text-blue-700 font-medium text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700 text-sm">Form Completion</span>
              <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={`bg-white border p-4 rounded-lg shadow-sm transition ${invalidFields.has(field.name)
                    ? "border-red-500 bg-red-50 hover:bg-red-100"
                    : "border-gray-100 hover:shadow-md hover:bg-blue-200"
                    }`}
                >
                  <InputField
                    label={field.label}
                    name={field.name}
                    type="radio"
                    value={formData[field.name]?.value || ""}
                    comment={formData[field.name]?.comment || ""}
                    onChange={handleChange}
                    options={["Yes", "No"]}
                    showCommentInput="true"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 mb-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-10 py-3 rounded-lg font-medium text-white shadow-lg transition text-base ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                  }`}
              >
                {loading ? "Submitting..." : "Submit Daily Record"}
              </button>
            </div>

            {errorMsg && (
              <div className="text-red-600 text-center font-medium mb-4">
                {errorMsg}
              </div>
            )}

            {submitSuccess && (
              <div className="mt-4 flex justify-center">
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-center text-sm font-medium border border-green-200">
                  ✅ Your accountability record has been submitted successfully!
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-6">
        Keep track of your daily progress and spiritual journey
      </div>
    </div>
  );
}

export default ApplicationForm;





















































//  _________________________________________________________________________________________________


// import { useEffect, useState } from "react";
// import { useFirebase } from "../../context/Me_Firebase";
// import { db } from "../../context/Me_Firebase";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import InputField from "../UI/reusable/InputField";
// import BackButton from "../UI/reusable/BackTo";
// import Show_username from "../UI/reusable/Show_username";

// function ApplicationForm() {
//   // const { user } = useFirebase();
//   // const abcd= user
//   // console.log(abcd, "12121221211");

//   const initialFormData = {
//     Tahajjud: { value: "", comment: "" },
//     Farz_Namazen: { value: "", comment: "" },
//     Zikr: { value: "", comment: "" },
//     Physical_Fitness: { value: "", comment: "" },
//     Career_Growth: { value: "", comment: "" },
//     Classes_Growth: { value: "", comment: "" },
//     Night_Analysis: { value: "", comment: "" },
//     Sleep_On_Time_10_PM: { value: "", comment: "" },
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [loading, setLoading] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [invalidFields, setInvalidFields] = useState(new Set());


  
  


//   const handleChange = (e) => {
//     const { name, value, dataset } = e.target;
//     const fieldType = dataset.type;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: {
//         ...prev[name],
//         [fieldType]: value,
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setSubmitSuccess(false);

//     const newInvalidFields = new Set();
//     Object.entries(formData).forEach(([key, field]) => {
//       if (!field.value.trim()) newInvalidFields.add(key);
//     });

//     if (newInvalidFields.size > 0) {
//       setInvalidFields(newInvalidFields);
//       setErrorMsg("⚠️ Please fill all the items before submitting.");
//       setTimeout(() => setErrorMsg(""), 3000);
//       return;
//     }

//     setInvalidFields(new Set());
//     setLoading(true);

//     const today = new Date().toISOString().split("T")[0];
//     const docId = `${user.uid}_${today}`;

//     try {
//       await setDoc(doc(db, "dailyForms", docId), {
//         userId: user.uid,
//         name: user.name || "Anonymous",
//         formData,
//         date: today,
//         createdAt: serverTimestamp(),
//       });
//       setSubmitSuccess(true);
//       setFormData(initialFormData);
//     } catch (error) {
//       setErrorMsg("Error saving data. Please try again.");
//     } finally {
//       setLoading(false);
//       setTimeout(() => setSubmitSuccess(false), 3000);
//     }
//   };

//   const completionPercentage = Math.round(
//     Object.values(formData).filter((f) => f.value.trim()).length /
//       Object.keys(formData).length *
//       100
//   );

//   const fields = [
//     { label: "🌙 Tahajjud", name: "Tahajjud" },
//     { label: "🕌 Farz Namazen", name: "Farz_Namazen" },
//     { label: "📿 Zikr", name: "Zikr" },
//     { label: "💪 Physical Fitness", name: "Physical_Fitness" },
//     { label: "🚀 Career Growth", name: "Career_Growth" },
//     { label: "📚 Classes Growth", name: "Classes_Growth" },
//     { label: "🌟 Night Analysis", name: "Night_Analysis" },
//     { label: "😴 Sleep On Time (10 PM)", name: "Sleep_On_Time_10_PM" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-200 to-indigo-200 py-6 px-2 sm:px-4">
//       <div className="flex justify-between items-center">
//         <BackButton label="Go Back" />
//         <span className="text-md font-medium text-gray-700">
//           Welcome, <Show_username />
//         </span>
//       </div>

//       <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
//           <h2 className="text-2xl font-bold mb-1">🌟 Daily Accountability Tracker</h2>
//           <p className="text-sm">Track your daily habits and spiritual practices</p>
//         </div>

//         <div className="p-6">
//           <div className="flex justify-center mb-6">
//             <div className="bg-blue-50 hover:bg-blue-500 hover:text-white border border-blue-200 px-5 py-2 rounded-full text-blue-700 font-medium shadow-sm text-sm transition">
//               {new Date().toLocaleDateString("en-US", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </div>
//           </div>

//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               <span className="font-medium text-gray-700 text-sm">Form Completion</span>
//               <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs">
//                 {completionPercentage}%
//               </span>
//             </div>
//             <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
//                 style={{ width: `${completionPercentage}%` }}
//               ></div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {fields.map((field) => (
//                 <div
//                   key={field.name}
//                   className={`bg-white border p-4 rounded-lg shadow-sm transition ${
//                     invalidFields.has(field.name)
//                       ? "border-red-500 bg-red-50 hover:bg-red-100"
//                       : "border-gray-100 hover:shadow-md hover:bg-blue-200"
//                   }`}
//                 >
//                   <InputField
//                     label={field.label}
//                     name={field.name}
//                     type="radio"
//                     value={formData[field.name]?.value || ""}
//                     comment={formData[field.name]?.comment || ""}
//                     onChange={handleChange}
//                     options={["Yes", "No"]}
//                     showCommentInput="true"
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-center mt-10 mb-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-10 py-3 rounded-lg font-medium text-white shadow-lg transition text-base ${
//                   loading
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
//                 }`}
//               >
//                 {loading ? "Submitting..." : "Submit Daily Record"}
//               </button>
//             </div>

//             {errorMsg && (
//               <div className="text-red-600 text-center font-medium mb-4">
//                 {errorMsg}
//               </div>
//             )}

//             {submitSuccess && (
//               <div className="mt-4 flex justify-center">
//                 <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-center text-sm font-medium border border-green-200">
//                   ✅ Your accountability record has been submitted successfully!
//                 </div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>

//       <div className="text-center text-gray-500 text-sm mt-6">
//         Keep track of your daily progress and spiritual journey
//       </div>
//     </div>
//   );
// }

// export default ApplicationForm;
