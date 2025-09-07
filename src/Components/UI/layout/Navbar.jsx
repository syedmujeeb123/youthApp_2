import { Link } from "react-router-dom";
import LogoDemo from "../reusable/Logo";
import ProfileModal from "../../pages/ProfileModal";
import { useAuth } from "../../../context/AuthContext";
//  _________________________________________________________________________________________________
// my changes

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "../../../context/Me_Firebase"; // adjust path
import { db } from "../../../context/Me_Firebase";

import Show_username from "../reusable/Show_username";


//  _________________________________________________________________________________________________









function Navbar() {
  // const { user } = useAuth();
  const { user, isloggedin } = useFirebase();
  const [userName, setUserName] = useState("Guest");


//  _________________________________________________________________________________________________
// my changes
    useEffect(() => {
    const fetchUserName = async () => {
      if (user && isloggedin) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || "User");
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      }
    };

    fetchUserName();
  }, [user, isloggedin]);







  


//  _________________________________________________________________________________________________

   return (
    <div className="fixed mt-8 z-50 left-0 right-0 mx-auto shadow-md p-1 rounded-full w-[90%] hover:bg-opacity-60 hover:text-white transition duration-300 bg-black bg-opacity-40 text-white">
      <div className="relative flex items-center h-16 justify-between">
        <div className="flex-shrink-0 cursor-pointer">
          <LogoDemo />
        </div>

        <ul className="absolute left-1/2 transform -translate-x-1/2 flex gap-6 text-white font-medium">
          <Link to="/"><li className="cursor-pointer hover:text-blue-600">Home</li></Link>
          <Link to="/application_form"><li className="cursor-pointer hover:text-blue-600">Accountability-Form</li></Link>
          <Link to="/about"><li className="cursor-pointer hover:text-blue-600">About Us</li></Link>
          <Link to="/contact"><li className="cursor-pointer hover:text-blue-600">Contact Us</li></Link>
        </ul>

        <div className="flex items-center">
          <p className="-mr-4 hover:font-bold cursor-pointer">
            {/* {userName } */}
            <Show_username />
          </p>
          <ProfileModal />
        </div>
      </div>
    </div>
  );
}


export default Navbar;
