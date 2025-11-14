/* ==============================
   
   - Main game engine: state, loop (rAF), input, physics, persistence
   - - Orchestrates everything, uses rAF loop, gameSpeed multiplier

   V0.0.1
   - Added touch controls
    - Fixed cube switching logic to avoid infinite loops
    - Improved level initialization on next level
    - Improved cleanup of timeouts on level restart/menu return
    - Various optimizations and bug fixes
    - Fixed Timeout Management | Proper dependency handling in useCallback hooks | Fixed Memory Leaks | Improved Input Handling
    - Enhanced Game State Management | Improved Audio Handling | Refined Collision Detection | Better Particle Effects
    - John@psseuro.com - 2025

    - App.tsx v0.0.2 - renamed as App.tsx from GameEngine.jsx. Addressed the following issuesissues
    ✅ A clean deterministic physics loop ✅ Proper dt scaling ✅ Correct cube ability system 
    ✅ Vercel-optimized canvas ✅ Touch controls ✅ Performance-matching across desktop/mobile


   ============================== */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Canvas from './components/Canvas';
import { levels } from './levels';
import { CUBE_SIZE } from './constants';
import type { Cube } from './types';
import { FIXED_STEP, MAX_STEPS, physicsStep } from './utils/physics';
import { InputManager } from './utils/input';
import Menu from './components/ui/Menu';
import HUD from './components/ui/HUD';
import PauseModal from './components/ui/PauseModal';
import TouchControls from './components/ui/TouchControls';
//import './App.css'; not used

function createCube(type:number): Cube {
  return { type, color: ['#FF6B35','#D4A574','#4ECDC4'][type] || '#fff', x:50, y:480, vx:0, vy:0, width:CUBE_SIZE, height:CUBE_SIZE, grounded:false, abilityActive:false, abilityDuration:0, dead:false, reachedGoal:false };
}

export default function App() {
  const [gameState, setGameState] = useState<'menu'|'playing'|'paused'|'levelComplete'|'gameOver'>('menu');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [activeCube, setActiveCube] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const input = useRef<InputManager|null>(null);
  const rendererRef = useRef<any>(null);

  const stateRef = useRef<any>(null);

  useEffect(()=>{ input.current = new InputManager(); return ()=> input.current?.destroy(); }, []);

  const initializeLevel = useCallback((levelId:number) => {
    const lvl = levels.find(l=>l.id===levelId)!;
    const cubes = lvl.cubes.map(t=>createCube(t));
    stateRef.current = { level: JSON.parse(JSON.stringify(lvl)), cubes, abilityTimers: cubes.map(()=>0), particles: [], score:0, startTime: Date.now() };
    setActiveCube(0);
  }, []);

  useEffect(()=>{ if (gameState === 'playing') { if (!stateRef.current) initializeLevel(currentLevel); startLoop(); } else { stopLoop(); } return ()=> stopLoop(); }, [gameState, currentLevel]);

  const lastRef = useRef<number| null>(null);
  const accRef = useRef<number>(0);
  const rafRef = useRef<number| null>(null);

  const startLoop = () => { lastRef.current = null; accRef.current = 0; if (!rafRef.current) rafRef.current = requestAnimationFrame(loop); };
  const stopLoop = () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };

  const processInput = (dt:number) => {
    const st = stateRef.current;
    if (!st) return;
    const left = input.current?.keys['ArrowLeft'] || input.current?.keys['a'];
    const right = input.current?.keys['ArrowRight'] || input.current?.keys['d'];
    st.cubes.forEach((cube:Cube, idx:number) => {
      if (cube.dead || cube.reachedGoal) return;
      const isActive = idx === activeCube;
      let moveSpeed = 120; // px per second baseline
      if (isActive && cube.abilityActive && cube.type === 2) moveSpeed = 240;
      if (left) cube.vx = -moveSpeed * gameSpeed;
      else if (right) cube.vx = moveSpeed * gameSpeed;
      else cube.vx = 0;
    });
  };

  const applyFixedStep = (dt:number) => {
    const st = stateRef.current;
    if (!st) return;
    physicsStep(st.cubes, st.level, dt, gameSpeed);
    // ability timers handled per frame
    st.abilityTimers.forEach((t:number, i:number)=>{ if (t>0) st.abilityTimers[i] = Math.max(0, t - 1); });
    const allReached = st.cubes.length>0 && st.cubes.every((c:Cube)=> c.reachedGoal);
    if (allReached) {
      setGameState('levelComplete');
      setScore(prev=>prev+1000);
    }
  };

  const loop = (ts:number) => {
    if (!lastRef.current) lastRef.current = ts;
    let delta = (ts - lastRef.current)/1000;
    lastRef.current = ts;
    delta = Math.min(delta, 0.1);
    input.current?.pollGamepad();
    processInput(delta);
    accRef.current += delta;
    let steps = 0;
    while (accRef.current >= FIXED_STEP && steps < MAX_STEPS) {
      applyFixedStep(FIXED_STEP);
      accRef.current -= FIXED_STEP;
      steps++;
    }
    rendererRef.current?.draw?.();
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(()=> {
    const onKey = (e:KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        const st = stateRef.current;
        if (!st) return;
        const cube = st.cubes[activeCube];
        if (!cube || cube.dead || cube.reachedGoal) return;
        const type = cube.type;
        const ability = type===0 ? 'bounce' : type===1 ? 'shrink' : type===2 ? 'dash' : 'none';
        if (ability === 'bounce' && cube.grounded) { cube.vy = -420 * gameSpeed * (1/60); } // translate to px/frame world
        else if (ability === 'shrink') { cube.width = CUBE_SIZE*0.5; cube.height = CUBE_SIZE*0.5; cube.abilityActive = true; cube.abilityDuration = 60; }
        else if (ability === 'dash') { cube.vx = (input.current?.keys['ArrowLeft'] ? -600 : 600) * gameSpeed * (1/60); cube.abilityActive = true; cube.abilityDuration = 20; }
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const st = stateRef.current;
        if (!st) return;
        const alive = st.cubes.filter((c:any)=> !c.dead && !c.reachedGoal);
        if (alive.length > 1) {
          setActiveCube(prev=>{
            let next = (prev+1) % st.cubes.length;
            let guard = 0;
            while ((st.cubes[next].dead || st.cubes[next].reachedGoal) && guard < 10) { next = (next+1)%st.cubes.length; guard++; }
            return next;
          });
        }
      }
      if (e.key === 'Escape') setGameState(prev=> prev==='paused' ? 'playing' : 'paused');
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [activeCube, gameState, gameSpeed]);

  const startLevel = (id:number) => { setCurrentLevel(id); initializeLevel(id); setGameState('playing'); };

  // touch controls handlers
  const handleTouchMove = (dx:number) => {
    if (!stateRef.current) return;
    if (dx > 10) { input.current!.keys['ArrowRight'] = true; input.current!.keys['ArrowLeft'] = false; }
    else if (dx < -10) { input.current!.keys['ArrowLeft'] = true; input.current!.keys['ArrowRight'] = false; }
    else { input.current!.keys['ArrowLeft'] = false; input.current!.keys['ArrowRight'] = false; }
  };
  const handleTouchAbility = () => {
    const ev = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(ev);
  };

  return (
    <div className='app-center'>
      <div className='panel'>
        {(gameState==='playing' || gameState==='paused') && (
          <div className='relative-container'>
            <Canvas ref={rendererRef} getState={()=>stateRef.current} score={score} activeIndex={activeCube} />
            <div className='controls-vertical'>
              <HUD score={score} onTogglePause={()=>setGameState(prev=> prev==='paused' ? 'playing' : 'paused')} gameSpeed={gameSpeed} setGameSpeed={setGameSpeed} />
            </div>
            {gameState==='paused' && <PauseModal onResume={()=>setGameState('playing')} onMenu={()=>setGameState('menu')} />}
            <TouchControls onMove={handleTouchMove} onAbility={handleTouchAbility} />
          </div>
        )}
        
        {gameState==='levelComplete' && <div className='panel'><h2>Level Complete</h2><button className='btn' onClick={()=>setGameState('menu')}>Menu</button></div>}
        {gameState==='gameOver' && <div className='panel'><h2>Game Over</h2><button className='btn' onClick={()=>initializeLevel(currentLevel)}>Retry</button></div>}
      </div>
    </div>
  );
}
