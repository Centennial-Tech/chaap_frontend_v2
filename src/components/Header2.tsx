import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useOverlay } from "../provider/overleyProvider";

const Header2 = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const logo = new URL("../assets/logo.svg", import.meta.url).href;
  const token = false;
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "CHAAP Agents", path: "/#agents" },
    { name: "Contact", path: "/contact" },
  ];
  const { showOverlay, hideOverlay } = useOverlay();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const { id } = e.target as any;
      if (id?.length > 0 && id == "global_overlay") {
        setIsOpen(false);
        hideOverlay();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <header
      className={`fixed flex justify-between items-center px-4 py-2 w-full hover:bg-white hover:shadow-sm ${
        scrolled ? "bg-white shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl flex justify-between items-center w-full mx-auto">
        <div className="flex gap-7 items-center w-full max-w-[500px]">
          <Link
            to={"/"}
            className="w-[150px]  items-center justify-center flex"
          >
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        <span className="hidden md:flex gap-2 items-center">
          {menuItems.map(({ name, path }) => (
            <Button key={name} href={path} name={name} />
          ))}
        </span>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => {
              setIsOpen((prev) => {
                if (!prev) {
                  showOverlay();
                }
                return !prev;
              });
            }}
            type="button"
            className="inline-flex items-center cursor-pointer p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                  stroke="#f37021"
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
                  stroke="#f37021"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            )}
          </button>
        </div>
        <div
          className={`${
            isOpen ? "w-[70%]" : "w-0"
          } flex justify-center md:hidden border-t shadow-lg fixed overflow-hidden transition-all duration-300 ease-in-out bg-[#ffffff] top-[67.5px] h-screen right-0 z-10`}
          id="navbar-default"
        >
          <div className="mt-10 flex flex-col items-center gap-3">
            {menuItems.map(({ name, path }) => (
              <Button
                onClick={() => setIsOpen(false)}
                key={name}
                href={path}
                name={name}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header2;
