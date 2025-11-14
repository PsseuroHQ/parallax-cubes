/* ==============================
 src/components/ui/HUD.tsx v0.0.1
============================== */
/*import React from 'react';


interface Props { score:number; onTogglePause: ()=>void; volume:number; setVolume:(v:number)=>void; gameSpeed:number; setGameSpeed:(v:number)=>void }


const HUD: React.FC<Props> = ({ score, onTogglePause, volume, setVolume, gameSpeed, setGameSpeed }) => {
return (
<div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
<div className="flex gap-2">
<button onClick={onTogglePause} className="bg-gray-800 p-2 rounded">Pause</button>
</div>
<div className="bg-gray-800 p-2 rounded text-white">Score: {score}</div>
<div className="bg-gray-800 p-2 rounded text-white flex items-center gap-2">
<label>Vol</label>
<input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e)=>setVolume(parseFloat(e.target.value))} />
</div>
<div className="bg-gray-800 p-2 rounded text-white flex items-center gap-2">
<label>Speed</label>
<input type="range" min={0.5} max={1.5} step={0.01} value={gameSpeed} onChange={(e)=>setGameSpeed(parseFloat(e.target.value))} />
</div>
</div>
);
};


export default HUD;*/

/*v0.0.2*/
import React from 'react';
import './HUD.css';
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