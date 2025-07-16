import React from 'react';
import { X } from 'lucide-react';
import Modal from './ui/Modal';
import DocPrepAgent from '../pages/agents/DocPrepAgent';

interface TabModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType?: string;
}

const TabModal: React.FC<TabModalProps> = ({ isOpen, onClose, documentType }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="max-w-7xl"
      showCloseButton={false}
    >
      <div className="h-[90vh] relative">
        {/* Close button positioned in top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg border border-gray-200 transition-all duration-200 hover:scale-110"
          title="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        
        <DocPrepAgent documentType={documentType} />
      </div>
    </Modal>
  );
};

export default TabModal; 