import { useState } from "react";
import RoutesDetails from "../../Routes/RoutesDetails";

function MainPage() {
  const [showNavbar, setShowNavbar] = useState(true);
  const toggleNavbar = () => {
    setShowNavbar((prev) => !prev);
  };
  return <RoutesDetails showNavbar={showNavbar} toggleNavbar={toggleNavbar} />;
}

export default MainPage;
