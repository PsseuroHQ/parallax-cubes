/* ==============================
 src/components/ui/HUD.tsx v0.0.2
============================== */

import React from 'react';

interface Props { score: number; onTogglePause: () => void; gameSpeed: number; setGameSpeed: (v: number) => void }
export default function HUD({ score, onTogglePause, gameSpeed, setGameSpeed }: Props) {
    return (
        <div className="hud">
            <button className='btn' onClick={onTogglePause}>Pause</button>
            <div className="hud-panel hud-score">Score: {score}</div>
            <div className="hud-panel hud-speed">
                <label htmlFor="hud-game-speed" className="hud-label">Speed {Math.round(gameSpeed * 100)}%</label>
                <input id="hud-game-speed" className="hud-range" title="Game speed" aria-label="Game speed" type='range' min={0.5} max={1.5} step={0.01} value={gameSpeed} onChange={(e) => setGameSpeed(parseFloat(e.target.value))} />
            </div>
        </div>
    );
}