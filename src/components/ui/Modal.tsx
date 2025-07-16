import React, { useEffect } from "react";
import { Z_INDEX } from "../../constants/zIndex";
import { useOverlay } from "../../provider/overleyProvider";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  showCloseButton?: boolean;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
  maxHeight = "max-h-[80vh]",
  showCloseButton = true,
}) => {
  const { showOverlay, hideOverlay } = useOverlay();

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      showOverlay();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (isOpen) {
        hideOverlay();
      }
    };
  }, [isOpen, onClose, showOverlay, hideOverlay]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/50"
      style={{ zIndex: Z_INDEX.MODAL }}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg ${maxWidth} w-full ${maxHeight} overflow-y-auto relative shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default ReusableModal;
