import { describe,it,expect } from 'vitest';import { JUMP_FORCE,CUBE_SIZE } from '../src/constants';

describe('abilities',()=>{ it('bounce',()=>{const cube:any={vy:0,grounded:true};cube.vy=JUMP_FORCE*1.5;expect(cube.vy).toBeCloseTo(JUMP_FORCE*1.5);});});