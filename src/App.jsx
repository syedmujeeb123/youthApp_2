import "./App.css";
import MainPage from "./Components/pages/MainPage";
import RoutesDetails from "./Routes/RoutesDetails";
import { OptimizedFirebaseProvider } from "./context/OptimizedFirebase";
import ErrorBoundary from "./Components/UI/reusable/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <OptimizedFirebaseProvider>
        <MainPage />
      </OptimizedFirebaseProvider>
    </ErrorBoundary>
  );
}

export default App;
