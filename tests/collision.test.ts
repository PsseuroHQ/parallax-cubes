import { describe,it,expect } from 'vitest';
import { rectsOverlap } from '../src/utils/physics';

describe('overlap',()=>{ it('yes',()=>{expect(rectsOverlap({x:0,y:0,width:10,height:10},{x:5,y:5,width:10,height:10})).toBe(true)})});