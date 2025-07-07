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
        className="group relative flex items-center justify-start w-11 h-11 rounded-full overflow-hidden bg-red-500 text-white shadow-md transition-all duration-300 ease-in-out hover:w-32 hover:rounded-[2.5rem] active:translate-x-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-300"
        aria-label="Logout"
      >
        <div className="flex items-center justify-center w-full transition-all duration-300 ease-in-out group-hover:w-1/3 group-hover:pl-5">
          <svg
            viewBox="0 0 512 512"
            className="w-4 h-4 fill-current text-white"
            aria-hidden="true"
          >
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
          </svg>
        </div>
        <span className="absolute right-0 w-0 opacity-0 text-white font-semibold text-lg transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:w-2/3 group-hover:pr-2 whitespace-nowrap">
          Logout
        </span>
      </button>
    );
  };

  const userName = `${user?.first_name} ${user?.last_name}` || "Loading...";

  // Format the current path for display as a breadcrumb path
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const formattedPath = pathSegments.length ? (
    <span className="flex items-center gap-1">
      <span className="text-gray-400"> &gt; </span>
      {pathSegments.map((seg, i) => {
        const isLast = i === pathSegments.length - 1;
        const path = "/" + pathSegments.slice(0, i + 1).join("/");

        return (
          <span key={i} className="flex items-center gap-1">
            <Link
              to={path}
              className={
                isLast
                  ? "text-gray-900 font-semibold hover:text-gray-700 transition-colors duration-200"
                  : "text-gray-600 hover:text-gray-700 transition-colors duration-200"
              }
            >
              {seg.charAt(0).toUpperCase() + seg.slice(1)}
            </Link>
            {i < pathSegments.length - 1 && (
              <span className="text-gray-400">&gt;</span>
            )}
          </span>
        );
      })}
    </span>
  ) : (
    <span className="text-blue-600 font-semibold">/ Dashboard</span>
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
          <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600">
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
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
