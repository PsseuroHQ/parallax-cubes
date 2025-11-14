/* ==============================
6) src/utils/particles.ts v0.0.2
- Small particle system for effects
============================== */

export const spawnParticles = (particles: any[], x: number, y: number, opts: { count?: number } = {}) => {
    const count = opts.count || 12;
    for (let i = 0; i < count; i++) {
        particles.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 1.5) * 4, life: 40 + Math.random() * 30, size: 2 + Math.random() * 3 });
    }
};

export const updateParticles = (particles: any[]) => {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.15;
        p.x += p.vx; p.y += p.vy;
        p.life -= 1;
        if (p.life <= 0) particles.splice(i, 1);
    }
};