import { Menu, X } from "lucide-react";
import type { FC } from "react";

interface MobileToggleProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const MobileToggle: FC<MobileToggleProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className="w-[48px] h-[48px] bg-white border border-gray-300 rounded-xl flex items-center justify-center shadow-sm cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? (
        <X size={24} className="text-gray-600" />
      ) : (
        <Menu size={24} className="text-gray-600" />
      )}
    </div>
  );
};

export default MobileToggle;
