import "./App.css";
import MainPage from "./Components/pages/MainPage";
import RoutesDetails from "./Routes/RoutesDetails";
import { SimpleFirebaseProvider } from "./context/SimpleFirebase";

function App() {
  return (
    <SimpleFirebaseProvider>
      <MainPage />
    </SimpleFirebaseProvider>
  );
}

export default App;
