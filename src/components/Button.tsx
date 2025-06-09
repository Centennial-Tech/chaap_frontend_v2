import React from "react";

interface ButtonProps {
  title: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-full
        bg-gradient-to-r from-[#034EA2] via-[#904ec8] to-[#f37021]
        text-white
        px-5 py-2 md:px-[30px] md:py-[10px]
        text-sm md:text-[15px]
        h-[29px] md:h-[40px]
        font-medium
        rounded-md
        cursor-pointer
        border-none
        flex justify-center items-center
        transition-colors duration-[0.9s] ease-in-out
        hover:bg-gradient-to-r hover:from-[#f37021] hover:via-[#904ec8] hover:to-[#034EA2]"
    >
      {title}
    </div>
  );
};

export default Button;
