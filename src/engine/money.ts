export type MinorUnits = number & { readonly __brand: 'MinorUnits' };

export function minor(value: number): MinorUnits {
  if (!Number.isSafeInteger(value)) {
    throw new Error('Money must be a safe integer in minor units');
  }
  return value as MinorUnits;
}
