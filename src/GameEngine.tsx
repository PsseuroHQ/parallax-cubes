/* ==============================
   - GameEngine.tsx v1.0.0
   - Main game engine: state, loop (rAF), input, physics, persistence
   - - Orchestrates everything, uses rAF loop, gameSpeed multiplier

   V1.0.1:
   - Added touch controls
    - Fixed cube switching logic to avoid infinite loops
    - Improved level initialization on next level
    - Improved cleanup of timeouts on level restart/menu return
    - Various optimizations and bug fixes
    - Fixed Timeout Management | Proper dependency handling in useCallback hooks | Fixed Memory Leaks | Improved Input Handling
    - Enhanced Game State Management | Improved Audio Handling | Refined Collision Detection | Better Particle Effects
    - John@psseuro.com - 2025


   ============================== */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import CanvasRenderer from './components/CanvasRenderer';
import AudioPool from './utils/audioPool';
import { levels } from './levels';
import { CANVAS_WIDTH, CANVAS_HEIGHT, CUBE_SIZE, GRAVITY, JUMP_FORCE, STORAGE_KEY, CUBE_DEFINITIONS } from './constants';
import { rectsOverlap, applyPhysics } from './utils/physics';
import { spawnParticles } from './utils/particles';
import { InputManager } from './utils/input';
import { loadSave, saveToLocal } from './hooks/useLocalSave';
import type { Cube } from './types';
import Menu from './components/ui/Menu';
import HUD from './components/ui/HUD';
import PauseModal from './components/ui/PauseModal';
import TouchControls from './components/ui/TouchControls';

const SAMPLE_MAP: Record<string, string> = {
  boing: '/assets/sfx/boing.wav',
  rustle: '/assets/sfx/rustle.wav',
  whoosh: '/assets/sfx/whoosh.wav',
  hit: '/assets/sfx/hit.wav',
  complete: '/assets/sfx/complete.wav'
};

interface GameState {
  level: any;
  cubes: Cube[];
  abilityTimers: number[];
  startTime: number;
  particles: any[];
}

interface SaveData {
  unlocked: number[];
  achievements: {
    levelsCompleted?: number;
    [key: string]: any;
  };
}

const GameEngine: React.FC = () => {
  const rendererRef = useRef<any>(null);
  const requestRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const audioPool = useRef<AudioPool | null>(null);

  const input = useRef<InputManager | null>(null);
  const [save, setSave] = useState<SaveData>(() => loadSave(STORAGE_KEY, { unlocked: [1], achievements: {} }));

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'levelComplete' | 'gameOver'>('menu');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [activeCube, setActiveCube] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.6);
  const [gameSpeed, setGameSpeed] = useState<number>(1);

  const gameStateRef = useRef<GameState | null>(null);
  const levelCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameOverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize audio pool
  useEffect(() => {
    audioPool.current = new AudioPool();
    audioPool.current
      .loadSamples(SAMPLE_MAP)
      .then(() => audioPool.current?.setVolume(volume))
      .catch(e => console.warn('Audio load failed', e));

    return () => {
      if (audioPool.current) (audioPool.current as any).destroy?.();
    };
  }, []);

  // Update audio volume
  useEffect(() => {
    if (audioPool.current) audioPool.current.setVolume(volume);
  }, [volume]);

  // Initialize input manager
  useEffect(() => {
    input.current = new InputManager();
    return () => input.current?.destroy();
  }, []);

  const initializeCubes = useCallback((levelIndex: number) => {
    const lvl = levels[levelIndex];
    const cubes: Cube[] = lvl.cubes.map(t => ({
      type: t,
      color: CUBE_DEFINITIONS[t].color,
      x: 50,
      y: 480,
      vx: 0,
      vy: 0,
      width: CUBE_SIZE,
      height: CUBE_SIZE,
      grounded: false,
      abilityActive: false,
      abilityDuration: 0,
      dead: false,
      reachedGoal: false
    }));

    const abilityTimers = cubes.map(() => 0);
    gameStateRef.current = {
      level: { ...lvl },
      cubes,
      abilityTimers,
      startTime: Date.now(),
      particles: []
    };
    setActiveCube(0);
  }, []);

  const startLevel = (n: number) => {
    setCurrentLevel(n);
    initializeCubes(n - 1);
    setGameState('playing');
  };

  const handleLevelComplete = useCallback(() => {
    if (levelCompleteTimeoutRef.current) clearTimeout(levelCompleteTimeoutRef.current);

    audioPool.current?.play('complete');
    const timeElapsed = ((Date.now() - (gameStateRef.current?.startTime || 0)) / 1000).toFixed(1);
    const levelScore = 1000 - Math.floor(parseFloat(timeElapsed) * 10);

    setScore(prev => prev + levelScore);

    const updatedSave = { ...save };
    updatedSave.unlocked = Array.from(
      new Set([...(updatedSave.unlocked || []), currentLevel + 1].filter(Boolean))
    ).filter((n: number) => n <= levels.length);
    updatedSave.achievements = updatedSave.achievements || {};
    updatedSave.achievements.levelsCompleted = (updatedSave.achievements.levelsCompleted || 0) + 1;

    setSave(updatedSave);
    saveToLocal(STORAGE_KEY, updatedSave);
    setGameState('levelComplete');
  }, [currentLevel, save]);

  const handleGameOver = useCallback(() => {
    if (gameOverTimeoutRef.current) clearTimeout(gameOverTimeoutRef.current);
    setGameState('gameOver');
  }, []);

  const update = useCallback(
    (dt: number) => {
      const gs = gameStateRef.current;
      if (!gs) return;

      input.current?.pollGamepad();

      // Update moving obstacles
      gs.level.obstacles.forEach((ob: any) => {
        if (ob.type === 'movingObstacle') {
          if (!ob._origin) {
            ob._origin = { x: ob.x, y: ob.y, dir: 1 };
          }

          if (ob.axis === 'x') {
            ob.x += ob.speed * ob._origin.dir * dt * gameSpeed;
            if (Math.abs(ob.x - ob._origin.x) > (ob.range || 100)) {
              ob._origin.dir *= -1;
            }
          } else {
            ob.y += ob.speed * ob._origin.dir * dt * gameSpeed;
            if (Math.abs(ob.y - ob._origin.y) > (ob.range || 100)) {
              ob._origin.dir *= -1;
            }
          }
        }
      });

      let allReached = true;

      gs.cubes.forEach((cube: Cube, idx: number) => {
        if (cube.dead || cube.reachedGoal) {
          if (!cube.reachedGoal) allReached = false;
          return;
        }

        applyPhysics(cube, dt * gameSpeed, GRAVITY);
        cube.grounded = false;

        // Collision detection
        gs.level.obstacles.forEach((ob: any) => {
          if (ob.type === 'platform') {
            if (
              rectsOverlap(cube, ob) &&
              cube.vy > 0 &&
              cube.y + cube.height - cube.vy < ob.y + 5
            ) {
              cube.y = ob.y - cube.height;
              cube.vy = 0;
              cube.grounded = true;
            }
          }

          if (ob.type === 'lava' && rectsOverlap(cube, ob)) {
            cube.dead = true;
            audioPool.current?.play('hit');
            spawnParticles(gs.particles, cube.x + cube.width / 2, cube.y + cube.height / 2, {
              count: 24
            });
            gameOverTimeoutRef.current = setTimeout(() => handleGameOver(), 400);
          }

          if (ob.type === 'goal' && rectsOverlap(cube, ob)) {
            cube.reachedGoal = true;
            cube.vx = 0;
            cube.vy = 0;
            spawnParticles(gs.particles, cube.x + cube.width / 2, cube.y + cube.height / 2, {
              count: 20
            });
          }
        });

        // Fall detection
        if (cube.y > CANVAS_HEIGHT) {
          cube.dead = true;
          audioPool.current?.play('hit');
          gameOverTimeoutRef.current = setTimeout(() => handleGameOver(), 400);
        }

        // Input handling
        const left = input.current?.keys['ArrowLeft'] || input.current?.keys['a'];
        const right = input.current?.keys['ArrowRight'] || input.current?.keys['d'];
        const speed = cube.abilityActive && CUBE_DEFINITIONS[cube.type].ability === 'dash' ? 8 : 4;

        if (left) cube.vx = -speed;
        if (right) cube.vx = speed;

        // Ability duration
        if (cube.abilityActive) {
          cube.abilityDuration -= dt * 60 * gameSpeed;
          if (cube.abilityDuration <= 0) {
            cube.abilityActive = false;
            if (CUBE_DEFINITIONS[cube.type].ability === 'shrink') {
              cube.width = CUBE_SIZE;
              cube.height = CUBE_SIZE;
            }
          }
        }

        // Ability timer cooldown
        if (gs.abilityTimers[idx] > 0) {
          gs.abilityTimers[idx] -= dt * 60 * gameSpeed;
        }

        if (!cube.reachedGoal) allReached = false;
      });

      // Check level completion
      if (allReached && gs.cubes.length > 0) {
        handleLevelComplete();
      }
    },
    [gameSpeed, currentLevel, save, handleGameOver, handleLevelComplete]
  );

  const renderLoop = useCallback(
    (ts: number) => {
      if (!lastTs.current) lastTs.current = ts;
      const delta = (ts - lastTs.current) / 1000;
      lastTs.current = ts;

      update(delta);
      if (rendererRef.current?.draw) rendererRef.current.draw();

      requestRef.current = requestAnimationFrame(renderLoop);
    },
    [update]
  );

  // Start/stop game loop
  useEffect(() => {
    if (gameState === 'playing') {
      lastTs.current = null;
      requestRef.current = requestAnimationFrame(renderLoop);
      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    }
  }, [gameState, renderLoop]);

  // Initialize level when game state changes
  useEffect(() => {
    if (gameState === 'menu') return;
    initializeCubes(currentLevel - 1);
  }, [gameState, currentLevel, initializeCubes]);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      const gs = gameStateRef.current;
      if (!gs) return;

      // Space: Ability
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        const cube = gs.cubes[activeCube];

        if (!cube || cube.dead || cube.reachedGoal) return;
        if (gs.abilityTimers[activeCube] > 0 || cube.abilityActive) return;

        const ability = CUBE_DEFINITIONS[cube.type].ability;

        if (ability === 'bounce' && cube.grounded) {
          cube.vy = JUMP_FORCE * 1.5;
          audioPool.current?.play('boing');
        } else if (ability === 'shrink') {
          cube.width = CUBE_SIZE * 0.5;
          cube.height = CUBE_SIZE * 0.5;
          audioPool.current?.play('rustle');
        } else if (ability === 'dash') {
          cube.vx = input.current?.keys['ArrowLeft'] ? -15 : 15;
          audioPool.current?.play('whoosh');
        }

        cube.abilityActive = true;
        cube.abilityDuration = 60;
        gs.abilityTimers[activeCube] = 120;
      }

      // Tab: Switch cube
      if (e.key === 'Tab') {
        e.preventDefault();
        const alive = gs.cubes.filter((c: Cube) => !c.dead && !c.reachedGoal);

        if (alive.length > 1) {
          setActiveCube(prev => {
            let next = (prev + 1) % gs.cubes.length;
            let iterations = 0;
            const maxIterations = gs.cubes.length;

            while (
              (gs.cubes[next].dead || gs.cubes[next].reachedGoal) &&
              iterations < maxIterations
            ) {
              next = (next + 1) % gs.cubes.length;
              iterations++;
            }

            return next;
          });
        }
      }

      // Escape: Pause
      if (e.key === 'Escape') {
        setGameState(prev => (prev === 'paused' ? 'playing' : 'paused'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCube, gameState]);

  // Touch controls bridge
  const handleTouchMove = (dx: number) => {
    if (!gameStateRef.current) return;

    if (dx > 10) {
      input.current!.keys['ArrowRight'] = true;
      input.current!.keys['ArrowLeft'] = false;
    } else if (dx < -10) {
      input.current!.keys['ArrowLeft'] = true;
      input.current!.keys['ArrowRight'] = false;
    } else {
      input.current!.keys['ArrowLeft'] = false;
      input.current!.keys['ArrowRight'] = false;
    }
  };

  const handleAbility = () => {
    const e = new KeyboardEvent('keydown', { key: ' ' });
    window.dispatchEvent(e);
  };

  const handleRetryLevel = () => {
    if (gameOverTimeoutRef.current) clearTimeout(gameOverTimeoutRef.current);
    if (levelCompleteTimeoutRef.current) clearTimeout(levelCompleteTimeoutRef.current);
    initializeCubes(currentLevel - 1);
    setGameState('playing');
  };

  const handleNextLevel = () => {
    if (levelCompleteTimeoutRef.current) clearTimeout(levelCompleteTimeoutRef.current);
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
      initializeCubes(currentLevel); // This will initialize the new level due to useEffect
      setGameState('playing');
    }
  };

  const handleReturnToMenu = () => {
    if (gameOverTimeoutRef.current) clearTimeout(gameOverTimeoutRef.current);
    if (levelCompleteTimeoutRef.current) clearTimeout(levelCompleteTimeoutRef.current);
    setGameState('menu');
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {gameState === 'menu' && <Menu save={save} onStartLevel={startLevel} />}
        {(gameState === 'playing' || gameState === 'paused') && (
          <div className="relative">
            <CanvasRenderer
              ref={rendererRef}
              gameStateRef={gameStateRef}
              score={score}
              activeCubeIndex={activeCube}
            />
            <HUD
              score={score}
              onTogglePause={() => setGameState(prev => (prev === 'paused' ? 'playing' : 'paused'))}
              volume={volume}
              setVolume={setVolume}
              gameSpeed={gameSpeed}
              setGameSpeed={setGameSpeed}
            />
            {gameState === 'paused' && (
              <PauseModal
                onResume={() => setGameState('playing')}
                onMenu={handleReturnToMenu}
              />
            )}
            <TouchControls onMove={handleTouchMove} onAbility={handleAbility} />
          </div>
        )}
        {gameState === 'levelComplete' && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-4xl text-green-400 mb-6">LEVEL COMPLETE!</h2>
            <p className="text-2xl text-white mb-8">Score: {score}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetryLevel}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
              >
                Retry Level
              </button>
              {currentLevel < levels.length ? (
                <button
                  onClick={handleNextLevel}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
                >
                  Next Level
                </button>
              ) : (
                <button
                  onClick={handleReturnToMenu}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded"
                >
                  Complete!
                </button>
              )}
            </div>
          </div>
        )}
        {gameState === 'gameOver' && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-4xl text-red-400 mb-6">GAME OVER</h2>
            <p className="text-xl text-white mb-8">Cube eliminated!</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetryLevel}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
              >
                Retry
              </button>
              <button
                onClick={handleReturnToMenu}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded"
              >
                Main Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameEngine;