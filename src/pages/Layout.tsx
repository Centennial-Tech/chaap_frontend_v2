import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Z_INDEX } from "../constants/zIndex";
import { useAuth } from "../provider/authProvider";
import Header3 from "../components/Header3";
import Navbar from "../components/Navbar";
import Sidebar from "../components/ui/SideNav";
import Footer from "../components/Footer";
import ScrollToHash from "../components/ScrollToHash";

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradient-purple via-gradient-green via-gradient-red to-gradient-blue bg-[length:400%_400%] animate-gradient-shift">
      <ScrollToHash />
      <div style={{ zIndex: Z_INDEX.HEADER }} className="relative">
        {!user ? <Header3 /> : <Navbar />}
      </div>
      <main className="flex flex-1">
        {user && <Sidebar />}
        <div className={`flex flex-col flex-1 ${user ? 'pt-20 px-4 md:px-8' : 'pt-20'}`}>
          <Outlet />
        </div>
      </main>
      {!user && <Footer />}
    </div>
  );
};

export default Layout; 