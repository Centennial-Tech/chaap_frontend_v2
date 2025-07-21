import { Bell, ChevronDown } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../provider/authProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Z_INDEX } from "../constants/zIndex";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logo = new URL("../assets/logo.svg", import.meta.url).href;
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userName = `${user?.first_name} ${user?.last_name}` || "Loading...";

  // Format the current path for display as a breadcrumb path
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const formattedPath = pathSegments.length ? (
    <nav className="flex items-center" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* Home/Dashboard icon */}
        <li className="flex items-center">
          <Link
            to="/"
            className="group flex items-center text-gray-500 hover:text-blue-600 transition-all duration-200"
          >
            <svg
              className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-sm font-medium">Home</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {pathSegments.map((seg, i) => {
          const isLast = i === pathSegments.length - 1;
          const path = "/" + pathSegments.slice(0, i + 1).join("/");
          const displayName = seg
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <li key={i} className="flex items-center">
              {/* Separator */}
              <svg
                className="w-4 h-4 text-gray-400 mx-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>

              {/* Breadcrumb link */}
              <Link
                to={path}
                className={`
                  group relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isLast
                      ? "text-blue-600 bg-blue-50 border border-blue-200 cursor-default"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 border border-transparent"
                  }
                `}
                aria-current={isLast ? "page" : undefined}
              >
                {/* Animated background for current page */}
                {isLast && (
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg animate-pulse" />
                )}

                {/* Text with subtle animation */}
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-200">
                  {displayName}
                </span>

                {/* Hover effect underline */}
                {!isLast && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  ) : (
    <Link
      to="/"
      className="group flex items-center text-blue-600 hover:text-blue-700 transition-all duration-200"
    >
      <svg
        className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
      <span className="text-sm font-semibold">Dashboard</span>
    </Link>
  );

  return (
    <nav
      className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-300 py-3"
      style={{ zIndex: Z_INDEX.HEADER }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 pl-3">
          <div className="flex items-center space-x-3">
            <Link
              to={"/"}
              className="w-[150px] items-center justify-center flex"
            >
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-1 text-sm text-gray-600 bg-gray-50/50 rounded-lg px-3 py-2 backdrop-blur-sm border border-gray-200/50">
            {formattedPath}
          </div>
        </div>

        <div className="flex items-center space-x-4 pr-6">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
            >
              <div className="text-right text-sm">
                <div className="font-bold text-gray-900">{userName}</div>
                <div className="text-gray-600">
                  {user?.organization_name || "Centennial Technologies"}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {userName
                    ? userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </div>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    isProfileDropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
