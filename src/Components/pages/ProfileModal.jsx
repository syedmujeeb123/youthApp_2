import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "../UI/reusable/ProfileIcon";

function ProfileModal() {
  const [showBox, setShowBox] = useState(false);

  const toggleBox = () => setShowBox((prev) => !prev);
  const closeBox = () => setShowBox(false);
  return (
    <div>
      <div onClick={toggleBox} className=" cursor-pointer relative">
        <ProfileIcon />
      </div>
      {showBox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          onClick={closeBox}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-40 text-center scale-90 animate-zoom"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Welcome!</h2>

            <Link to="/profile">
              <p className="text-gray-600 mb-2">Profile</p>
            </Link>
            <Link to="/signup">
              <p className="text-gray-600 mb-2">Signup</p>
            </Link>
            <Link to="/login">
              <p className="text-gray-600 mb-2 cursor-pointer">Login</p>
            </Link>

            <Link to="/logout">
              <p className="text-gray-600 mb-2">Logout</p>
            </Link>

            <button
              onClick={closeBox}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileModal;
