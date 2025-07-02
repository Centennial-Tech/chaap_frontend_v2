import { NavLink, useLocation } from "react-router-dom";
const Button = ({ href, name, onClick = () => {}, notNav = false }: any) => {
  const location = useLocation();

  const isActive = `${location.pathname}${location.hash}` === href;

  return (
    <NavLink
      onClick={onClick}
      className={`py-1.5 px-1.5 w-max text-base rounded transition-all duration-300 ease-in-out ${
        isActive && !notNav 
          ? "text-gray-900 font-bold hover:text-gray-700" 
          : "text-gray-600 font-normal hover:text-gray-700"
      }`}
      to={href}
      end
    >
      {name}
    </NavLink>
  );
};

export default Button;
