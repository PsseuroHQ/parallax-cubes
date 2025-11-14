/* ==============================
 src/components/ui/HUD.tsx v1.0.0
============================== */
import React from 'react';


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


export default HUD;