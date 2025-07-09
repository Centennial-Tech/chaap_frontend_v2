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
    } else {
      hideOverlay();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      hideOverlay();
    };
  }, [isOpen, onClose, showOverlay, hideOverlay]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Content */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: Z_INDEX.MODAL }}
      >
        <div 
          className={`bg-white rounded-lg p-6 ${maxWidth} w-full ${maxHeight} overflow-y-auto relative`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            )}
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </>
  );
};

export default ReusableModal;
