import { Bell } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../provider/authProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logo = new URL("../assets/logo.svg", import.meta.url).href;

  const LogoutButton: React.FC = () => {
    const handleLogout = async () => {
      await logout();
      navigate("/login");
    };
    return (
      <button
        onClick={handleLogout}
        className="group relative flex items-center justify-start w-11 h-11 rounded-full overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:w-32 hover:rounded-[2.5rem] active:translate-x-0.5 active:translate-y-0.5 bg-red-600 hover:bg-red-700 text-white"
        aria-label="Logout"
      >
        <div className="flex items-center justify-center w-11 h-11 flex-shrink-0 transition-all duration-300 ease-in-out group-hover:w-11 group-hover:pl-3">
          <svg
            viewBox="0 0 512 512"
            className="w-4 h-4 fill-current text-white"
            aria-hidden="true"
          >
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
          </svg>
        </div>
        <span className="absolute left-11 w-0 opacity-0 text-white font-semibold text-sm transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:w-auto group-hover:pr-3 whitespace-nowrap">
          Logout
        </span>
      </button>
    );
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
    <nav className="fixed top-0 w-full bg-white border-b border-gray-300 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 pl-3">
          <div className="flex items-center space-x-3">
            <Link
              to={"/"}
              className="w-[150px] items-center justify-center flex"
            >
              <img src={logo} alt="Logo" />
            </Link>

            {/* <h1 className="text-xl font-semibold text-gray-900">
              MedDevice Compliance Suite
            </h1> */}
          </div>
          <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600 bg-gray-50/50 rounded-lg px-3 py-2 backdrop-blur-sm border border-gray-200/50">
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
          {/* <Button /> */}

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <Link
              to="/profile"
              className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
            >
              <div className="text-right text-sm">
                <div className="font-bold text-gray-900">{userName}</div>
                <div className="text-gray-600">
                  {user?.organization_name || "Centennial Technologies"}
                </div>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {userName
                  ? userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U"}
              </div>
            </Link>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
