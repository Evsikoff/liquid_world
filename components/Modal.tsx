import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  actions?: React.ReactNode;
  isOpen: boolean;
  isMobile?: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, actions, isOpen, isMobile = false }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 ${isMobile ? 'p-2' : 'p-4'}`}>
      <div className={`bg-white shadow-2xl w-full overflow-hidden transform transition-all scale-100 ${isMobile ? 'rounded-xl max-w-[95vw]' : 'rounded-2xl max-w-md'}`}>
        <div className={`bg-gradient-to-r from-blue-500 to-cyan-500 ${isMobile ? 'p-3' : 'p-4'}`}>
          <h2 className={`font-bold text-white text-center ${isMobile ? 'text-base' : 'text-xl'}`}>{title}</h2>
        </div>
        <div className={`text-slate-700 leading-relaxed text-center ${isMobile ? 'p-3 text-sm' : 'p-6 text-lg'}`}>
          {children}
        </div>
        <div className={`bg-slate-50 flex justify-center ${isMobile ? 'p-2 gap-2' : 'p-4 gap-3'}`}>
          {actions}
          {onClose && (
            <button
              onClick={onClose}
              className={`rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors ${isMobile ? 'px-4 py-1.5 text-sm' : 'px-6 py-2'}`}
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
