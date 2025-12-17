import React from 'react';
import { ContainerDef } from '../types';

interface ContainerProps {
  def: ContainerDef;
  currentAmount: number;
  isSelected: boolean;
  isSource: boolean;
  onClick: () => void;
}

const Container: React.FC<ContainerProps> = ({ def, currentAmount, isSelected, isSource, onClick }) => {
  const percentage = Math.min(100, Math.max(0, (currentAmount / def.capacity) * 100));

  // Calculate proportional size based on capacity
  // Base size for 500ml: 120px width, 200px height
  // Scale factor: Allow variation from roughly 0.8x to 1.3x for capacities between 300ml and 1000ml
  const scaleFactor = 0.7 + (def.capacity / 1500); 
  const width = Math.round(140 * scaleFactor);
  const height = Math.round(220 * scaleFactor);

  return (
    <div className="flex flex-col items-center mx-4 group cursor-pointer" onClick={onClick}>
      {/* Volume Labels */}
      <div className="mb-2 text-sm font-bold text-slate-700 bg-white/80 px-2 py-1 rounded shadow-sm">
        <span className="text-blue-600">{currentAmount}</span> / {def.capacity} мл
      </div>

      {/* The Vessel */}
      <div 
        className={`relative transition-transform duration-300 ${isSelected ? '-translate-y-4 scale-105' : 'group-hover:-translate-y-1'}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        )}

        {/* Sprite / Visual Representation */}
        {def.spriteUrl ? (
          <div className="relative w-full h-full">
            {/* 
                Sprite Image. 
                opacity-80 and mix-blend-multiply makes it semi-transparent so liquid behind is visible. 
                pointer-events-none ensures clicks pass through to the container div.
            */}
            <img 
              src={def.spriteUrl} 
              alt={def.name} 
              className="w-full h-full object-contain z-10 relative pointer-events-none opacity-80 mix-blend-multiply" 
            />
            {/* Liquid overlay for sprites */}
            <div 
              className="absolute bottom-0 left-[10%] right-[10%] bg-blue-500/80 transition-all duration-700 ease-in-out z-0 rounded-b-xl"
              style={{ height: `${percentage * 0.9}%`, bottom: '5%' }} // Adjusted height/bottom to fit typical jar sprites better
            ></div>
          </div>
        ) : (
          // CSS Placeholder Container (Glass Beaker Style)
          <div className={`relative w-full h-full border-4 border-t-0 rounded-b-3xl overflow-hidden bg-slate-100/20 backdrop-blur-sm shadow-xl
                          ${isSelected ? 'border-yellow-400 shadow-yellow-200' : 'border-slate-400'}`}>
            
            {/* Liquid */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-blue-500/80 liquid-transition border-t border-blue-400"
              style={{ height: `${percentage}%` }}
            >
              {/* Bubbles / Surface effect */}
              <div className="w-full h-2 bg-blue-300/50 absolute top-0"></div>
            </div>

            {/* Glass Reflection */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
          </div>
        )}
      </div>

      <div className="mt-3 font-semibold text-slate-800 text-center select-none">{def.name}</div>
      
      {isSelected && (
        <div className="text-xs text-yellow-600 font-medium mt-1">
          {isSource ? "Выбрано (откуда)" : "Куда лить?"}
        </div>
      )}
    </div>
  );
};

export default Container;