/* ==============================
src/constants.ts - v0.0.1
updated v0.0.2 to address lags
============================== */
/*export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const CUBE_SIZE = 30;
export const GRAVITY = 0.6;
export const JUMP_FORCE = -12;


export const STORAGE_KEY = 'cubic_odyssey_save_v1_ts';


export const COLORS = {
    background: '#1a1a2e',
    platform: '#16213e',
    platformStroke: '#0f3460',
    lava: '#ff3232',
    goal: '#32ff32',
    uiText: '#ffffff'
};


export const CUBE_DEFINITIONS = [
    { name: 'BOUNCE', color: '#FF6B35', ability: 'bounce' as const, soundId: 'boing' },
    { name: 'MINI', color: '#D4A574', ability: 'shrink' as const, soundId: 'rustle' },
    { name: 'DASH', color: '#4ECDC4', ability: 'dash' as const, soundId: 'whoosh' }
];*/

/* v0.0.2*/
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const CUBE_SIZE = 30;
export const GRAVITY = 0.6;
export const JUMP_FORCE = -12;
export const STORAGE_KEY = 'parallax_cubes_save_v1';

export const CUBE_DEFINITIONS = [
    { name: 'BOUNCE', color: '#FF6B35', ability: 'bounce' as const },
    { name: 'MINI', color: '#D4A574', ability: 'shrink' as const },
    { name: 'DASH', color: '#4ECDC4', ability: 'dash' as const }
] as const;