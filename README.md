# 🎮 Parallax Cubes

A physics-driven puzzle platformer featuring three cubes, each with unique abilities.

⭐ Overview

CubeShift is a fast-paced 2D puzzle-platformer built with React, TypeScript, Vite, and Canvas rendering.
You control a team of cubes — each with a special ability — to overcome hazards, solve spatial puzzles, and reach the goal.

Every level challenges you to combine movement, timing, and ability switching to guide all cubes safely through lava pits, platforms, gaps, and moving obstacles.

🧩 Core Features
🟧 Three Ability Cubes

Each cube has a unique ability:

Bounce Cube — jumps higher and can super-bounce.

Mini Cube — shrinks to half size to slip under tight spaces.

Dash Cube — bursts forward with high-speed dashes.

🎮 Responsive Controls

Supports:

Keyboard

Gamepad (auto-detected)

Mobile touch controls (joystick + ability button)

⚙️ Polished Game Engine

Custom physics (gravity, friction, velocity)

Collision detection (platforms, walls, gaps, ceilings)

Moving obstacles with dynamic ranges

Particle effects for hits, goal completion, and abilities

Canvas rendering with parallax backgrounds

🔄 Progression System

Levels unlock dynamically based on performance

Save system powered by localStorage

Achievements tracked automatically

🧪 Fully Tested

Core physics and mechanics are covered by a Vitest suite:

Gravity

Collisions

Moving obstacles

Hazard/goal logic

Abilities

🎯 How to Play
Movement
Action Keyboard Gamepad
Move Left ← or A Left Stick ←
Move Right → or D Left Stick →
Jump / Ability Space A / Cross
Switch Cube Tab LB/RB
Pause Esc Start
Mobile (Touch)

Left control pad → Move

Red button → Ability

Goal

Guide all cubes to the green goal block.
If any cube dies (lava/hazard), the level resets.

Abilities

Bounce: Space while grounded → huge jump

Shrink: Space → reduced hitbox for a short duration

Dash: Space → quick horizontal burst

Each ability has a cooldown indicator drawn around the cube.
