import { describe, it, expect } from 'vitest';
import { applyPhysics } from '../src/utils/physics';
import { CUBE_SIZE } from '../src/constants';

describe('applyPhysics', () => {
  it('applies gravity', () => {
    const cube:any = {x:0,y:0,vx:0,vy:0,width:CUBE_SIZE,height:CUBE_SIZE};
    applyPhysics(cube,1,0.6);
    expect(cube.vy).toBeCloseTo(0.6);
  });
});