/* ==============================
   src/components/CanvasRenderer.tsx v1.0.0
   - Pure renderer that takes game state and draws to canvas
   ============================== */
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { updateParticles } from '../utils/particles';
import type { Cube, Level } from '../types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;


export interface RendererHandle { draw: () => void; canvas?: HTMLCanvasElement | null; spawnParticlesAt?: (x: number, y: number, opts?: any) => void }


interface Props { gameStateRef: React.MutableRefObject<any>; score: number; activeCubeIndex: number; }


const CanvasRenderer = forwardRef<RendererHandle, Props>(({ gameStateRef, score, activeCubeIndex }: Props, ref: React.Ref<RendererHandle>) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<any[]>([]);


  useImperativeHandle(ref, () => ({
    draw,
    canvas: canvasRef.current,
    spawnParticlesAt: (x: number, y: number, opts?: any) => spawnParticles(particles.current, x, y, opts)
  }));


  function draw() {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


    // parallax background
    const bgOffset = (Date.now() / 200) % CANVAS_WIDTH;
    ctx.fillStyle = '#0b0c10'; ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    for (let i = 0; i < 5; i++) ctx.fillRect((bgOffset * (i + 1) * 0.2) % CANVAS_WIDTH, i * 80, CANVAS_WIDTH / 2, 2);


    const g = gameStateRef.current as { level: Level; cubes: Cube[]; abilityTimers: number[]; particles?: any[] } | null;
    if (!g) return;


    // draw obstacles
    g.level.obstacles.forEach(ob => {
      switch (ob.type) {
        case 'platform': ctx.fillStyle = '#16213e'; ctx.fillRect(ob.x, ob.y, ob.width, ob.height); ctx.strokeStyle = '#0f3460'; ctx.strokeRect(ob.x, ob.y, ob.width, ob.height); break;
        case 'lava': const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7; ctx.fillStyle = `rgba(255,50,50,${pulse})`; ctx.fillRect(ob.x, ob.y, ob.width, ob.height); break;
        case 'goal': const glow = Math.sin(Date.now() / 300) * 0.4 + 0.6; ctx.fillStyle = `rgba(50,255,50,${glow})`; ctx.fillRect(ob.x, ob.y, ob.width, ob.height); ctx.strokeStyle = '#00ff00'; ctx.strokeRect(ob.x, ob.y, ob.width, ob.height); break;
        case 'movingObstacle': ctx.fillStyle = '#ffcc00'; ctx.fillRect(ob.x, ob.y, ob.width, ob.height); break;
      }
    });


    // draw cubes
    g.cubes.forEach((cube, idx) => {
      if (cube.dead) return;
      if (idx === activeCubeIndex && !cube.reachedGoal) { ctx.strokeStyle = cube.color; ctx.lineWidth = 4; ctx.strokeRect(cube.x - 5, cube.y - 5, cube.width + 10, cube.height + 10); }
      const stretch = 1 - Math.max(0, Math.min(1, cube.vy / 20));
      const h = cube.height * (1 + (1 - stretch) * 0.2);
      const w = cube.width * (1 - (1 - stretch) * 0.1);
      ctx.fillStyle = cube.abilityActive ? '#fff' : cube.color;
      ctx.fillRect(cube.x, cube.y + (cube.height - h), w, h);
      ctx.strokeStyle = cube.reachedGoal ? '#00ff00' : '#000'; ctx.lineWidth = 2; ctx.strokeRect(cube.x, cube.y + (cube.height - h), w, h);
      const cooldownPercent = 1 - (g.abilityTimers[idx] / 120);
      if (cooldownPercent < 1) { ctx.beginPath(); ctx.arc(cube.x + cube.width / 2, cube.y + cube.height / 2, 15, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * cooldownPercent)); ctx.strokeStyle = cube.color; ctx.lineWidth = 3; ctx.stroke(); }
    });


    updateParticles(particles.current);
    particles.current.forEach(p => { ctx.globalAlpha = Math.max(0, p.life / 60); ctx.fillStyle = '#ffd'; ctx.fillRect(p.x, p.y, p.size, p.size); ctx.globalAlpha = 1; });


    ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Arial'; ctx.fillText(g.level.name, 20, 40); ctx.fillText(`Score: ${score}`, 20, 70);
  }


  return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border-4 border-gray-700 rounded-lg mx-auto" />;
});


export default CanvasRenderer;

function spawnParticles(current: any, x: number, y: number, opts: any) {
  throw new Error('Function not implemented.');
}
