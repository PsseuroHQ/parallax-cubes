/* ==============================
src/components/ui/TouchControls.tsx v0.0.2
- Simple on-screen joystick and buttons for mobile
============================== */

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