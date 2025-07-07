import React, { useEffect, useContext } from "react";
import { OverlayContext } from "../../provider/overleyProvider";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  showCloseButton?: boolean;
  overlayStrategy?: 'local' | 'global' | 'none';
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
  maxHeight = "max-h-[80vh]",
  showCloseButton = true,
  overlayStrategy = 'local',
}) => {
  // Check if overlay context is available
  const overlayContext = useContext(OverlayContext);
  const showGlobalOverlay = overlayContext?.showOverlay;
  const hideGlobalOverlay = overlayContext?.hideOverlay;

  // Handle global overlay only if context is available
  useEffect(() => {
    if (overlayStrategy === 'global' && overlayContext && showGlobalOverlay && hideGlobalOverlay) {
      if (isOpen) {
        showGlobalOverlay();
      } else {
        hideGlobalOverlay();
      }
    }
  }, [isOpen, overlayStrategy, overlayContext, showGlobalOverlay, hideGlobalOverlay]);

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
    <>
      {/* Local overlay */}
      {overlayStrategy === 'local' && (
        <div 
          className="fixed inset-x-0 top-[-44px] bottom-0 z-[60] bg-black/40"
          onClick={onClose}
        />
      )}
      
      {/* Modal Content */}
      <div className="fixed inset-x-0 top-[60px] bottom-0 z-[70] flex items-center justify-center">
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
    </>
  );
};

export default ReusableModal;
