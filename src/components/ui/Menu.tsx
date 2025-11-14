/* ==============================
src/components/ui/Menu.tsx v0.0.2
============================== */
import React from 'react';
import { levels } from '../../levels';
interface Props { onStart: (id: number) => void }
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
