import React from "react";
import { LuX } from "react-icons/lu";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 
        flex items-center justify-center 
        bg-black/40
        overflow-y-auto
      "
    >
      <div className="relative w-full max-w-2xl p-4">
        <div className="relative bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="
                text-gray-500 hover:text-gray-800 
                bg-transparent hover:bg-gray-100 
                rounded-full w-8 h-8 flex items-center justify-center
                transition-colors duration-200
              "
            >
              <LuX size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 overflow-y-auto max-h-[80vh]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
