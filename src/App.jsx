import "./App.css";
import MainPage from "./Components/pages/MainPage";
import RoutesDetails from "./Routes/RoutesDetails";
import { FirebaseProvider } from "./context/Me_Firebase";

function App() {
  return (
    <FirebaseProvider>
      <MainPage />
    </FirebaseProvider>
  );
}

export default App;
