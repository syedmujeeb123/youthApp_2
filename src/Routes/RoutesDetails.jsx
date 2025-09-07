// optimized and cleaned up code
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ROUTES_NAMES from "./routesNames";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { useFirebase } from "../context/OptimizedFirebase";
import { useAuth } from "../context/AuthContext";
import { 
  LazyAbout, 
  LazyContact, 
  LazyHome, 
  LazyApplicationForm, 
  LazyLoginForm, 
  LazySignUpForm, 
  LazyForgotPassword, 
  LazyLogout, 
  LazyAdmindash, 
  LazyPendingUsersAdmin, 
  LazyStudentSummaryIndividual,
  LazyWrapper 
} from "../utils/lazyComponents";

function RoutesDetails({ showNavbar, toggleNavbar }) {
  const { token } = useAuth();
  const {
    user,
    isloggedin,
    userInfoLoading,
    userInfo,
    loading
  } = useFirebase();

  if (userInfoLoading || loading) {
    return <div className="text-center mt-10 text-blue-500">🔄 Loading user info...</div>;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LazyWrapper />}>
        <Routes>
          <Route
            path={ROUTES_NAMES.HOME}
            element={
              <ProtectedRoute>
                <LazyHome toggleNavbar={toggleNavbar} showNavbar={showNavbar} />
              </ProtectedRoute>
            }
          />

          <Route path={ROUTES_NAMES.ABOUT} element={<LazyAbout />} />
          <Route path={ROUTES_NAMES.CONTACT} element={<LazyContact />} />

          <Route
            path={ROUTES_NAMES.APPLICATION_FORM}
            element={
              <ProtectedRoute>
                <LazyApplicationForm />
              </ProtectedRoute>
            }
          />

          <Route path={ROUTES_NAMES.SIGNUP} element={<LazySignUpForm />} />
          <Route path={ROUTES_NAMES.LOGIN} element={<LazyLoginForm />} />
          <Route path={ROUTES_NAMES.FORGOT_PASSWORD} element={<LazyForgotPassword />} />
          <Route path={ROUTES_NAMES.LOGOUT} element={<LazyLogout />} />

          <Route
            path={ROUTES_NAMES.Admindash}
            element={
              <AdminProtectedRoute>
                <LazyAdmindash />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/pending-users"
            element={
             <AdminProtectedRoute>
                <LazyPendingUsersAdmin />
            </AdminProtectedRoute>
            }
          />

          <Route
            path="/student/summary"
            element={
              <ProtectedRoute>
                <LazyStudentSummaryIndividual />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to={token ? ROUTES_NAMES.HOME : ROUTES_NAMES.LOGIN} />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default RoutesDetails;




























// working code
//  _________________________________________________________________________________________________




// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import ROUTES_NAMES from "./routesNames";
// import About from "../Components/pages/About";
// import Contact from "../Components/pages/Contact";
// import Home from "../Components/Home";
// import ApplicationForm from "../Components/forms/ApplicationForm";
// import LoginForm from "../Components/forms/LoginForm";
// import SignUpForm from "../Components/forms/SignUpForm";
// import ForgotPassword from "../Components/forms/ForgotPassword";
// import Logout from "../Components/forms/Logout";
// import ProtectedRoute from "./ProtectedRoute";
// import AdminProtectedRoute from "./AdminProtectedRoute";
// // import AdminDashboard from "../../admin/adminDashboard";
// import Admindash from "../../admin/Admindash";
// import PendingUsersAdmin from "../../admin/pending_users/PendingUsersAdmin";
// import StudentSummaryIndividual from "../Components/students/StudentSummaryIndividual";
// import { useFirebase } from "../context/Me_Firebase" // ✅ Import here
// import { useAuth } from "../context/AuthContext";

// function RoutesDetails({ showNavbar, toggleNavbar }) {
//   const { token } = useAuth();
//   const { user, isloggedin, userInfoLoading } = useFirebase(); // ✅ Firebase state



//   console.log("✅ ROUTES: isloggedin", isloggedin, user);



//   if (userInfoLoading) {
//     return <div className="text-center mt-10 text-blue-500">🔄 Loading user info...</div>;
//   }
//   // 🕒 Wait until userInfo is loaded before rendering routes
//   const { userInfo, loading } = useFirebase();
//   if (loading) {
//     return <div>Loading...</div>;
//   }


//   return (
//     <BrowserRouter>
//       <Routes>







//         <Route
//           path={ROUTES_NAMES.HOME}
//           element={
//             <ProtectedRoute>
//               <Home toggleNavbar={toggleNavbar} showNavbar={showNavbar} />
//             </ProtectedRoute>
//           }
//         />

//         <Route path={ROUTES_NAMES.ABOUT} element={<About />} />
//         <Route path={ROUTES_NAMES.CONTACT} element={<Contact />} />

//         <Route
//           path={ROUTES_NAMES.APPLICATION_FORM}
//           element={
//             <ProtectedRoute>
//               <ApplicationForm />
//             </ProtectedRoute>
//           }
//         />

//         <Route path={ROUTES_NAMES.SIGNUP} element={<SignUpForm />} />
//         <Route path={ROUTES_NAMES.LOGIN} element={<LoginForm />} />
//         <Route path={ROUTES_NAMES.FORGOT_PASSWORD} element={<ForgotPassword />} />
//         <Route path={ROUTES_NAMES.LOGOUT} element={<Logout />} />

//         <Route
//           path="*"
//           element={<Navigate to={token ? ROUTES_NAMES.HOME : ROUTES_NAMES.LOGIN} />}
//         />

//         {/* ✅ Admin Protected Routes
//         <Route
//           path={ROUTES_NAMES.AdminDashboard}
//           element={
//             <AdminProtectedRoute>
//               <AdminDashboard />
//             </AdminProtectedRoute>
//           }
//         /> */}

//         <Route
//           path={ROUTES_NAMES.Admindash}
//           element={
//             <AdminProtectedRoute>
//             <Admindash />
//             </AdminProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin/pending-users"
//           element={
//             <AdminProtectedRoute>
//               <PendingUsersAdmin />
//             </AdminProtectedRoute>
//           }
//         />


//         <Route path="/student/summary" element={<ProtectedRoute><StudentSummaryIndividual /></ProtectedRoute>} />





















//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default RoutesDetails;
