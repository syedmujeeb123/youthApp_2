import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // optional: if you're using lucide-react or similar icons

function BackButton({ to = -1, label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
    >
      <ArrowLeft className="w-5 h-5" />
      {label}
    </button>
  );
}

export default BackButton;
