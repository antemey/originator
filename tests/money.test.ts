import { describe, expect, it } from 'vitest';
import { minor } from '../src/engine/money';

describe('Minor-unit type contract (no business rounding)', () => {
  it('preserves safe integers exactly', () => {
    for (const value of [0, -1, 1234, Number.MAX_SAFE_INTEGER])
      expect(minor(value)).toBe(value);
  });
  it.each([
    12.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ])('rejects unsafe money %s', (value) => {
    expect(() => minor(value)).toThrow('safe integer');
  });
});
