import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import { useAuth } from "../provider/authProvider";
import { Z_INDEX } from "../constants/zIndex";

const Header2 = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const logo = new URL("../assets/logo.svg", import.meta.url).href;
  // const menuItems = [
  //   { name: "Home", path: "/" },
  //   { name: "CHAAP Agents", path: "/#agents" },
  //   { name: "Contact", path: "/contact" },
  // ];

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <header
      className={`fixed flex justify-between items-center py-2 w-full hover:bg-white hover:shadow-sm ${
        scrolled ? "bg-white shadow-sm" : ""
      }`}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-7 items-center w-full max-w-[500px] pl-3">
          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
              type="button"
              className="inline-flex items-center cursor-pointer p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-controls="navbar-default"
              aria-expanded="false"
              data-collapse-toggle="navbar-default"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 17 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="#6b7280"
                    strokeWidth={2}
                    d="M1 1h15M1 7h15M1 13h15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="#6b7280"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              )}
            </button>
          </div>
          <Link to={"/"} className="w-[150px] items-center justify-center flex">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <span className="inline-flex gap-3 pr-4">
          <span className="hidden md:flex gap-2 items-center">
            {/* {menuItems.map(({ name, path }) => (
              <Button key={name} href={path} name={name} />
            ))} */}
          </span>

          <Button
            onClick={() => {
              if (user) {
                logout();
              } else {
                navigate("/login");
              }
            }}
            variant="outline"
            size={useMediaQuery(theme.breakpoints.down("sm")) ? "sm" : "lg"}
            color="inherit"
            className="!font-extrabold hidden md:inline-flex"
          >
            {user ? "Logout" : "Login"}
          </Button>
        </span>
        <div
          className={`${
            isOpen ? "w-[70%]" : "w-0"
          } flex justify-center md:hidden border-t shadow-lg fixed overflow-hidden transition-all duration-300 ease-in-out bg-white top-[67.5px] h-screen left-0`}
          style={{ zIndex: Z_INDEX.MOBILE_MENU }}
          id="navbar-default"
        >
          <div className="mt-10 flex flex-col items-center gap-3">
            {/* {menuItems.map(({ name, path }) => (
              <Button 
                onClick={() => setIsOpen(false)}
                key={name}
                href={path}
                name={name}
              />
            ))} */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header2;
