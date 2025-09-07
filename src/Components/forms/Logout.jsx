import { useFirebase } from "../../context/Me_Firebase";
import { useNavigate } from "react-router-dom";

function Logout() {
  const { logout } = useFirebase();

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}

export default Logout;
