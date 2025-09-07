import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FirebaseProvider } from "./context/Me_Firebase.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FirebaseProvider>

        <App />
        
      </FirebaseProvider>
    </AuthProvider>
  </StrictMode>
);
