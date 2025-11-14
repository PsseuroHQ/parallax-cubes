/* ==============================
 src/utils/physics.ts v0.0.2
- Collision helpers and a small physics step
============================== */

import type { Cube, Obstacle } from '../types';
import { GRAVITY } from '../constants';

// Fixed timestep deterministic physics module
export const FIXED_STEP = 1 / 60; // 60Hz fixed-step
export const MAX_STEPS = 5;

export const rectsOverlap = (a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) => {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
};

export const physicsStep = (cubes: Cube[], level: { obstacles: Obstacle[] }, dt: number, speedMultiplier: number) => {
    // dt here = FIXED_STEP
    const gravity = GRAVITY * speedMultiplier;
    cubes.forEach((cube, idx) => {
        if (cube.dead || cube.reachedGoal) return;

        // integrate velocities
        cube.vy += gravity * dt;
        cube.x += cube.vx * dt * 60; // scale to feel consistent (vx in px/frame)
        cube.y += cube.vy * dt * 60;

        // simple ground friction
        cube.vx *= Math.pow(0.85, dt * 60);

        // collisions with obstacles (platforms)
        cube.grounded = false;
        level.obstacles.forEach(ob => {
            if (ob.type === 'platform') {
                if (rectsOverlap(cube, ob) && cube.vy > 0 && cube.y + cube.height - cube.vy < ob.y + 5) {
                    cube.y = ob.y - cube.height;
                    cube.vy = 0;
                    cube.grounded = true;
                }
            }
            if (ob.type === 'lava' && rectsOverlap(cube, ob)) {
                cube.dead = true;
            }
            if (ob.type === 'goal' && rectsOverlap(cube, ob)) {
                cube.reachedGoal = true;
                cube.vx = 0; cube.vy = 0;
            }
        });

        // bounds check
        if (cube.y > 1000) cube.dead = true;
    });

    // moving obstacles update
    level.obstacles.forEach(ob => {
        if (ob.type === 'movingObstacle') {
            if (!ob._origin) ob._origin = { x: ob.x, y: ob.y, dir: 1 };
            if (ob.axis === 'x') {
                ob.x += (ob.speed || 2) * ob._origin.dir * dt * 60 * speedMultiplier;
                if (Math.abs(ob.x - ob._origin.x) > (ob.range || 100)) ob._origin.dir *= -1;
            } else {
                ob.y += (ob.speed || 2) * ob._origin.dir * dt * 60 * speedMultiplier;
                if (Math.abs(ob.y - ob._origin.y) > (ob.range || 100)) ob._origin.dir *= -1;
            }
        }
    });
};