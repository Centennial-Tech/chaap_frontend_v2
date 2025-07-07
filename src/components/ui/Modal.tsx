import React, { useEffect } from "react";
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

  // Show/hide overlay when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      showOverlay();
    } else {
      hideOverlay();
    }
  }, [isOpen, showOverlay, hideOverlay]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-[60px] bottom-0 z-50 flex items-center justify-center">
      <div className={`bg-white rounded-lg p-6 ${maxWidth} w-full mx-4 ${maxHeight} overflow-y-auto relative`}>
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
  );
};

export default ReusableModal;
