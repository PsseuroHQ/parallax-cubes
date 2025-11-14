/* ==============================
   src/components/CanvasRenderer.tsx v0.0.2
   - Pure renderer that takes game state and draws to canvas

   v0.0.2 renamed as Canvas.tsx

   ============================== */

import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

interface Props { getState: () => any; score: number; activeIndex: number; }
export type CanvasHandle = { draw: () => void; canvas: HTMLCanvasElement | null };

const Canvas = forwardRef<CanvasHandle, Props>(({ getState, score, activeIndex }, ref) => {
  const canvRef = useRef<HTMLCanvasElement | null>(null);
  const dprRef = useRef<number>(1);

  useEffect(() => {
    const canvas = canvRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = CANVAS_WIDTH + 'px';
    canvas.style.height = CANVAS_HEIGHT + 'px';
    ctx.scale(dpr, dpr);
  }, []);

  useImperativeHandle(ref, () => ({
    draw,
    canvas: canvRef.current
  }));


  function draw() {
    const canvas = canvRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // background
    ctx.fillStyle = '#0b0c10';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const state = getState();
    if (!state) return;
    const level = state.level;
    // draw obstacles
    level.obstacles.forEach((ob: any) => {
      if (ob.type === 'platform') {
        ctx.fillStyle = '#16213e';
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
        ctx.strokeStyle = '#0f3460';
        ctx.strokeRect(ob.x, ob.y, ob.width, ob.height);
      } else if (ob.type === 'lava') {
        ctx.fillStyle = 'rgba(255,50,50,0.8)';
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
      } else if (ob.type === 'goal') {
        ctx.fillStyle = 'rgba(50,255,50,0.8)';
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
      } else if (ob.type === 'movingObstacle') {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
      }
    });

    // draw cubes
    state.cubes.forEach((cube: any, idx: number) => {
      if (cube.dead) return;
      if (idx === activeIndex && !cube.reachedGoal) {
        ctx.strokeStyle = cube.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(cube.x - 4, cube.y - 4, cube.width + 8, cube.height + 8);
      }
      ctx.fillStyle = cube.abilityActive ? '#fff' : cube.color;
      ctx.fillRect(cube.x, cube.y, cube.width, cube.height);
      ctx.strokeStyle = cube.reachedGoal ? '#00ff00' : '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(cube.x, cube.y, cube.width, cube.height);
    });

    // UI
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(level.name, 20, 40);
    ctx.fillText('Score: ' + (state.score || 0), 20, 70);
  }

  //return //<canvas ref={canvRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ borderRadius: 12 }} />;

  return <canvas ref={canvRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border-4 border-gray-700 rounded-lg mx-auto" />;
});

export default Canvas;

