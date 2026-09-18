export type MinorUnits = number & { readonly __brand: 'MinorUnits' };

export function minor(value: number): MinorUnits {
  if (!Number.isSafeInteger(value)) {
    throw new Error('Money must be a safe integer in minor units');
  }
  return value as MinorUnits;
}

// Six fractional decimal places of cents, matching WC_Tax's internal rounding.
export const SCALE = 1_000_000;

export function checked(value: number): number {
  if (!Number.isSafeInteger(value)) throw new RangeError('Unsafe arithmetic');
  return value;
}

export function roundRatio(
  numerator: number,
  denominator: number,
  half: 'up' | 'down' = 'up',
): number {
  checked(numerator);
  checked(denominator);
  if (numerator < 0 || denominator <= 0) throw new RangeError('Invalid ratio');
  const remainder = numerator % denominator;
  const quotient = (numerator - remainder) / denominator;
  return checked(
    quotient +
      Number(
        half === 'up'
          ? remainder >= denominator / 2
          : remainder > denominator / 2,
      ),
  );
}

export function cents(value: number, half: 'up' | 'down' = 'up'): MinorUnits {
  return minor(roundRatio(value, SCALE, half));
}

export function inclusiveTax(gross: number, rate: number): number {
  // Rates are integer tenths of a percent (55 or 200), not binary fractions.
  return roundRatio(checked(gross * rate), 1000 + rate);
}
