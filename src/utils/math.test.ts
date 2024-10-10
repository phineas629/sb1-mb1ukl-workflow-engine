import { describe, it, expect } from 'vitest';
import { add, subtract } from './math';

describe('Math functions', () => {
  it('should add two numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  it('should subtract two numbers correctly', () => {
    expect(subtract(3, 2)).toBe(1);
    expect(subtract(-1, 1)).toBe(-2);
    expect(subtract(0, 0)).toBe(0);
  });
});
