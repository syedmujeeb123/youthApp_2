import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout({ children, hiddenNavbar = false, hideFooter = false }) {
  return (
    <div className="flex flex-col min-h-screen">
      {!hiddenNavbar && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default Layout;
