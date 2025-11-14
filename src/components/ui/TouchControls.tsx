/* ==============================
src/components/ui/TouchControls.tsx v0.0.1
- Simple on-screen joystick and buttons for mobile
============================== */
/*import React, { useRef } from 'react';


interface Props { onMove:(dx:number)=>void; onAbility:()=>void }


const TouchControls: React.FC<Props> = ({ onMove, onAbility }) => {
const startX = useRef<number | null>(null);


const handleTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
const handleTouchMove = (e: React.TouchEvent) => {
if (startX.current == null) return;
const dx = e.touches[0].clientX - startX.current;
onMove(dx);
};
const handleTouchEnd = () => { startX.current = null; onMove(0); };


return (
<div className="fixed bottom-6 left-6 flex gap-6 items-end pointer-events-none">
<div className="w-40 h-40 bg-gray-800 bg-opacity-50 rounded-full pointer-events-auto touch-pan-y" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} />
<button className="w-20 h-20 bg-red-600 rounded-full text-white pointer-events-auto" onTouchStart={(e)=>{ e.preventDefault(); onAbility(); }}>Ability</button>
</div>
);
};


export default TouchControls;*/

/*v0.0.2*/
import React from 'react';
interface Props { onMove: (dx: number) => void; onAbility: () => void }
export default function TouchControls({ onMove, onAbility }: Props) {
    let startX: number | null = null;
    const handleStart = (e: React.TouchEvent) => { startX = e.touches[0].clientX; };
    const handleMove = (e: React.TouchEvent) => { if (startX == null) return; const dx = e.touches[0].clientX - startX; onMove(dx); };
    const handleEnd = () => { startX = null; onMove(0); };

    return (
        <>
            <div className='touch-dpad' onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd} />
            <button className='touch-ability btn' onTouchStart={(e) => { e.preventDefault(); onAbility(); }}>A</button>
        </>
    );
}