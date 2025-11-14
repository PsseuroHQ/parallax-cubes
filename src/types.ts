/* ==============================
 src/types.ts v0.0.2
============================== */

export type Ability = 'bounce' | 'shrink' | 'dash' | 'none';

export interface Cube {
    type: number; // index into CUBE_DEFINITIONS
    color: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    grounded: boolean;
    abilityActive: boolean;
    abilityDuration: number;
    dead: boolean;
    reachedGoal: boolean;
}

export interface Obstacle {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    speed?: number;
    axis?: 'x' | 'y';
    range?: number;
    _origin?: { x: number; y: number; dir: number };
}

export interface Level {
    id: number;
    name: string;
    cubes: number[];
    obstacles: Obstacle[];
}