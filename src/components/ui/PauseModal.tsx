/* ==============================
src/components/ui/PauseModal.tsx v0.0.2
============================== */

import React from 'react';

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
