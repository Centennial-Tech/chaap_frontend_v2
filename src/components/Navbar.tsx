import { Bell } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../provider/authProvider";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const logo = new URL("../assets/logo.svg", import.meta.url).href;

  const userName = `${user?.first_name} ${user?.last_name}` || "Loading...";

  // Format the current path for display as a breadcrumb path
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const formattedPath = pathSegments.length ? (
    <span className="flex items-center gap-1">
      <span className="text-gray-400">/</span>
      {pathSegments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1">
          <span
            className={
              i === pathSegments.length - 1
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }
          >
            {seg.charAt(0).toUpperCase() + seg.slice(1)}
          </span>
          {i < pathSegments.length - 1 && (
            <span className="text-gray-400">/</span>
          )}
        </span>
      ))}
    </span>
  ) : (
    <span className="text-blue-600 font-semibold">/ Dashboard</span>
  );

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-300 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <Link
              to={"/"}
              className="w-[150px]  items-center justify-center flex"
            >
              <img src={logo} alt="Logo" />
            </Link>

            {/* <h1 className="text-xl font-semibold text-gray-900">
              MedDevice Compliance Suite
            </h1> */}
          </div>
          <div className="hidden md:flex items-center space-x-1 text-sm text-gray-700">
            {formattedPath}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Button>
          {/* <Button /> */}

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right text-sm">
              <div className="font-bold text-gray-900">{userName}</div>
              <div className="text-gray-700">
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
        </div>
      </div>
    </nav>
  );
}
