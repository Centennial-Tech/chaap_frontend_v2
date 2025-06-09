import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import MobileToggle from "./MobileToggle";
import { useOverlay } from "../provider/overleyProvider";

const Header = () => {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "CHAAP Agents", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const agents = [
    { label: "Pre-Submission Strategy Agent", href: "#agent" },
    { label: "Regulatory Document Preparation Agent", href: "#agent2" },
    { label: "FDA Meeting Prep Agent", href: "#agent3" },
    { label: "Regulatory Knowledge Agent", href: "#agent4" },
    { label: "Post Market Surveillance Agent", href: "#agent5" },
  ];
  const logo = new URL("../assets/logo.svg", import.meta.url).href;

  const [isOpen, setIsOpen] = useState(false);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showOverlay } = useOverlay();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const { id } = e.target as any;
      if (id?.length > 0 && id == "global_overlay") {
        setIsAgentsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getAgents = () => {
    return (
      <li
        className="border-b md:border-none"
        style={{ borderColor: "rgb(207, 207, 207)" }}
      >
        <span
          className="m-auto md:mr-10 px-4 py-2 md:px-0 md:py-0 md:m-[unset] font-semibold text-[18px] flex items-center dropdown w-max cursor-pointer"
          onClick={() => {
            setIsAgentsOpen((prev) => !prev);
            showOverlay();
          }}
        >
          CHAAP Agents
        </span>
        <ul
          ref={dropdownRef as any}
          className={`shadow-md mx-auto bg-white max-w-[538px] static md:absolute top-[83.55px] rounded-b-[15px] rounded-t-none overflow-hidden transition-[max-height] duration-500 ease-in-out p-0 ${
            isAgentsOpen ? "mb-[10px]" : "max-h-0"
          }`}
        >
          {agents.map(({ label, href }) => (
            <li className="font-medium p-[12px] hover:text-[#212529] hover:bg-[#f8f9fa] text-center">
              <Link to={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[51] w-full
    bg-white flex flex-col items-center
    pt-[8px] pb-[20px]        
    transition-[max-height]   
    duration-500 ease-in-out  
    ${isOpen ? "max-h-[1000px]" : "max-h-[90px]"}`}
    >
      <div className="w-full max-w-[1260px] mx-auto px-[20px] flex justify-between items-center">
        <div className="w-full h-full p-0.5">
          <img src={logo} alt="logo" className="w-[150px] md:w-[230px]" />
        </div>
        <div className="flex gap-2 items-center">
          <ul className="hidden md:flex font-medium">
            {menuItems.map((item, index) => {
              return index == 1 ? (
                getAgents()
              ) : (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="last:mr-10 font-semibold text-[18px] cursor-pointer"
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="w-[65.13px] md:w-[106px]">
            <Button title="LOGIN" />
          </div>
          <div className="md:hidden">
            <MobileToggle isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
      {
        <ul
          className={`md:hidden mt-3 overflow-hidden transition-[max-height] duration-500 ease-in-out font-medium w-full ${
            isOpen ? "" : "hidden"
          }`}
        >
          {menuItems.map((item, index) => {
            return index == 1 ? (
              getAgents()
            ) : (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="block px-4 py-2 text-[18px] text-center rounded w-full border-b cursor-pointer"
                  style={{ borderColor: "#cfcfcf" }}
                  onClick={() => setIsOpen(false)} // Close on click
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      }
    </header>
  );
};

export default Header;
