import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Button = ({ href, name, onClick = () => {}, notNav = false }: any) => {
  const location = useLocation();

  const isActive = `${location.pathname}${location.hash}` === href;

  return (
    <NavLink
      onClick={onClick}
      className={`py-1.5 px-1.5 text-[#000000] hover:text-[#f37021] hover:bg-primary text-base rounded font-extrabold transition-all duration-300 ease-in-out ${
        isActive && !notNav ? "!text-[#f37021]" : ""
      }`}
      to={href}
      end
    >
      {name}
    </NavLink>
  );
};

export default Button;
