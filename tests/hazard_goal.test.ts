import { describe,it,expect } from 'vitest';import { rectsOverlap } from '../src/utils/physics';

describe('hazard',()=>{ it('lava',()=>{const c:any={x:10,y:10,width:10,height:10,dead:false};const l={x:5,y:5,width:30,height:30};if(rectsOverlap(c,l))c.dead=true;expect(c.dead).toBe(true);});});