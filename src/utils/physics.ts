/* ==============================
 src/utils/physics.ts v1.0.0
- Collision helpers and a small physics step
============================== */
import type { Cube, Obstacle } from '../types';


export const rectsOverlap = (a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) => {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
};


export const applyPhysics = (cube: Cube, dt: number, gravity: number) => {
    cube.vy += gravity * dt;
    cube.x += cube.vx * dt;
    cube.y += cube.vy * dt;
    cube.vx *= Math.pow(0.85, dt); // friction scaled by dt
};