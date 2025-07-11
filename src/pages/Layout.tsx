import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  // Determine which header to show based on the route
  const renderHeader = () => {
    if (location.pathname === "/") {
      return <Header3 />;
    }
    if (location.pathname === "/login" || location.pathname === "/signup") {
      return null;
    }
    if (user) {
      return <Navbar />;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradient-purple via-gradient-green via-gradient-red to-gradient-blue bg-[length:400%_400%] animate-gradient-shift">
      <ScrollToHash />
      <div style={{ zIndex: Z_INDEX.HEADER }} className="relative">
        {renderHeader()}
      </div>
      <main className="flex flex-1 relative">
        {user && <Sidebar onExpandChange={setIsSidebarExpanded} />}
        <div 
          data-main-content 
          className={`flex flex-col flex-1 transition-all duration-500 ease-in-out ${
            user ? `pt-20 px-4 md:px-8 ${isSidebarExpanded ? 'ml-72' : 'ml-16'}` : 
            location.pathname === "/login" || location.pathname === "/signup" ? '' : 'pt-20'
          }`}
        >
          <Outlet />
        </div>
      </main>
      {location.pathname === "/" && <Footer />}
    </div>
  );
};

export default Layout; 