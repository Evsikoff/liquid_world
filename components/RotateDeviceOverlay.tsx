import React from 'react';
import { Smartphone, RotateCcw } from 'lucide-react';

const RotateDeviceOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex flex-col items-center justify-center p-8">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        {/* Animated phone icon */}
        <div className="relative mb-8">
          <div className="animate-rotate-phone">
            <Smartphone size={120} strokeWidth={1.5} className="text-white/90" />
          </div>

          {/* Rotation arrow */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 animate-pulse">
            <RotateCcw size={32} className="text-yellow-300" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-black mb-4 drop-shadow-lg">
          Поверните устройство
        </h2>

        <p className="text-white/80 text-lg max-w-xs mx-auto leading-relaxed">
          Для лучшего игрового опыта переверните телефон в горизонтальное положение
        </p>

        {/* Visual hint */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="w-12 h-20 border-3 border-white/40 rounded-lg flex items-center justify-center">
            <div className="w-1 h-8 bg-white/40 rounded-full" />
          </div>
          <div className="text-3xl animate-bounce">→</div>
          <div className="w-20 h-12 border-3 border-white rounded-lg flex items-center justify-center shadow-lg shadow-white/20">
            <div className="w-8 h-1 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes rotate-phone {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-15deg);
          }
          75% {
            transform: rotate(15deg);
          }
        }
        .animate-rotate-phone {
          animation: rotate-phone 2s ease-in-out infinite;
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default RotateDeviceOverlay;
