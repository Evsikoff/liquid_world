import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  actions?: React.ReactNode;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, actions, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
          <h2 className="text-xl font-bold text-white text-center">{title}</h2>
        </div>
        <div className="p-6 text-slate-700 text-lg leading-relaxed text-center">
          {children}
        </div>
        <div className="p-4 bg-slate-50 flex justify-center gap-3">
          {actions}
          {onClose && (
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
            >
              Закрыть
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
