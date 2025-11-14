import { describe,it,expect } from 'vitest';

describe('moving',()=>{ it('flip',()=>{ const ob:any={x:0,_origin:{x:0,dir:1},speed:2,axis:'x',range:10}; for(let i=0;i<20;i++){ ob.x+=ob.speed*ob._origin.dir; if(Math.abs(ob.x-ob._origin.x)>ob.range) ob._origin.dir*=-1;} expect([1,-1]).toContain(ob._origin.dir);});});