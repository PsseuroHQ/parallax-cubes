/* ==============================
src/levels.ts v0.0.2
============================== */

import type { Level } from './types';

export const levels: Level[] = [
    {
        id: 1,
        name: 'THE AWAKENING',
        cubes: [0],
        obstacles: [
            { type: 'platform', x: 0, y: 550, width: 200, height: 50 },
            { type: 'platform', x: 300, y: 450, width: 150, height: 30 },
            { type: 'platform', x: 550, y: 350, width: 150, height: 30 },
            { type: 'goal', x: 700, y: 300, width: 50, height: 50 }
        ]
    },
    {
        id: 2,
        name: 'THE PROVING GROUNDS',
        cubes: [0, 1],
        obstacles: [
            { type: 'platform', x: 0, y: 550, width: 200, height: 50 },
            { type: 'wall', x: 250, y: 400, width: 30, height: 150 },
            { type: 'lowCeiling', x: 200, y: 450, width: 150, height: 100 },
            { type: 'platform', x: 400, y: 500, width: 200, height: 30 },
            { type: 'goal', x: 700, y: 450, width: 50, height: 50 }
        ]
    },
    {
        id: 3,
        name: 'THE DUAL CHALLENGE',
        cubes: [0, 2],
        obstacles: [
            { type: 'platform', x: 0, y: 550, width: 150, height: 50 },
            { type: 'platform', x: 250, y: 400, width: 100, height: 30 },
            { type: 'gap', x: 350, y: 0, width: 200, height: 600 },
            { type: 'platform', x: 600, y: 450, width: 150, height: 30 },
            { type: 'goal', x: 700, y: 400, width: 50, height: 50 }
        ]
    },
    {
        id: 4,
        name: 'CHAOS ASCENDING',
        cubes: [1, 2],
        obstacles: [
            { type: 'platform', x: 0, y: 550, width: 150, height: 50 },
            { type: 'lava', x: 150, y: 570, width: 200, height: 30 },
            { type: 'platform', x: 350, y: 500, width: 100, height: 30 },
            { type: 'movingObstacle', x: 400, y: 300, width: 40, height: 40, speed: 2, axis: 'x', range: 120 },
            { type: 'platform', x: 550, y: 450, width: 150, height: 30 },
            { type: 'goal', x: 700, y: 400, width: 50, height: 50 }
        ]
    },
    {
        id: 5,
        name: 'TRINITY TRIAL',
        cubes: [0, 1, 2],
        obstacles: [
            { type: 'platform', x: 0, y: 550, width: 120, height: 50 },
            { type: 'platform', x: 200, y: 450, width: 100, height: 30 },
            { type: 'lava', x: 300, y: 570, width: 150, height: 30 },
            { type: 'lowCeiling', x: 450, y: 400, width: 100, height: 100 },
            { type: 'gap', x: 550, y: 0, width: 100, height: 600 },
            { type: 'platform', x: 650, y: 500, width: 150, height: 30 },
            { type: 'goal', x: 720, y: 450, width: 50, height: 50 }
        ]
    }
];
