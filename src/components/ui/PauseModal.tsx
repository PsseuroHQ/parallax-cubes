/* ==============================
src/components/ui/PauseModal.tsx v0.0.1
============================== */
/*import React from 'react';
import { motion } from 'framer-motion';


interface Props { onResume: ()=>void; onMenu: ()=>void }


const PauseModal: React.FC<Props> = ({ onResume, onMenu }) => {
return (
<motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
<div className="bg-gray-800 p-8 rounded-lg text-center">
<h2 className="text-3xl text-white mb-6">PAUSED</h2>
<p className="text-white mb-4">Press SPACE to Resume</p>
<div className="flex gap-4">
<button onClick={onResume} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded">Resume</button>
<button onClick={onMenu} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded">Main Menu</button>
</div>
</div>
</motion.div>
);
};


export default PauseModal;*/

/*v0.0.2*/
import React from 'react';
//import './PauseModal.css'; // not used

interface Props { onResume: () => void; onMenu: () => void }
export default function PauseModal({ onResume, onMenu }: Props) {
    return (
        <div className='pause-overlay'>
            <div className='pause-modal'>
                <h2>PAUSED</h2>
                <p>Press Space to resume</p>
                <div className='pause-buttons'>
                    <button className='btn' onClick={onResume}>Resume</button>
                    <button className='btn' onClick={onMenu}>Menu</button>
                </div>
            </div>
        </div>
    );
}
