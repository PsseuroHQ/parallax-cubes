/* ==============================
src/components/ui/Menu.tsx v0.0.1
============================== */
/*import React from 'react';
import { motion } from 'framer-motion';
import { levels } from '../../levels';


interface Props { save: any; onStartLevel: (id:number)=>void }


const Menu: React.FC<Props> = ({ save, onStartLevel }) => {
return (
<motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} className="bg-gray-800 rounded-lg p-8 text-center">
<h1 className="text-5xl font-bold text-white mb-4">CUBIC ODYSSEY</h1>
<h2 className="text-2xl text-blue-400 mb-8">Trinity Trial</h2>
<div className="mb-8">
<h3 className="text-xl text-white mb-4">Select Level</h3>
<div className="grid grid-cols-5 gap-4">
{levels.map((level)=>{
const unlocked = (save.unlocked || []).includes(level.id);
return (
<button key={level.id} onClick={()=>unlocked && onStartLevel(level.id)} className={`py-4 px-6 rounded-lg transition ${unlocked ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
<div className="font-bold">Level {level.id}</div>
<div className="text-sm">{level.name}</div>
</button>
);
})}
</div>
</div>
</motion.div>
);
};


export default Menu;*/

/*v0.0.2*/
import React from 'react';
import { levels } from '../../levels';
interface Props { onStart: (id: number) => void }
/*export default function Menu({ onStart }: Props) {
    return (
        <div style={{ background: '#111827', padding: 24, borderRadius: 12 }}>
            <h1 style={{ fontSize: 32 }}>Parallax Cubes</h1>
            <p style={{ opacity: 0.8 }}>Three cubes. One goal. Use abilities to solve.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginTop: 16 }}>
                {levels.map(l => <button key={l.id} className='btn' onClick={() => onStart(l.id)}>Level {l.id}<div style={{ fontSize: 12 }}>{l.name}</div></button>)}
            </div>
        </div>
    );
}*/


export default function Menu({ onStart }: Props) {
    return (
        <div className="menu">
            <h1 className="menu__title">Parallax Cubes</h1>
            <p className="menu__subtitle">Three cubes. One goal. Use abilities to solve.</p>
            <div className="menu__levels">
                {levels.map(l => (
                    <button key={l.id} className="btn menu__level" onClick={() => onStart(l.id)}>
                        <span>Level {l.id}</span>
                        <div className="menu__levelName">{l.name}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
