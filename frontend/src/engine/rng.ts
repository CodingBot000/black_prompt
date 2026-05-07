const MOD = 2_147_483_647;
const MULT = 48_271;

export function normalizeSeed(seed: number): number {
  const normalized = Math.floor(Math.abs(seed)) % MOD;
  return normalized === 0 ? 1 : normalized;
}

export function nextRngState(state: number): number {
  return (normalizeSeed(state) * MULT) % MOD;
}

export function randomFloat(state: number): { value: number; nextState: number } {
  const nextState = nextRngState(state);
  return { value: nextState / MOD, nextState };
}

export function randomInt(state: number, min: number, max: number): { value: number; nextState: number } {
  const roll = randomFloat(state);
  return {
    value: Math.floor(roll.value * (max - min + 1)) + min,
    nextState: roll.nextState,
  };
}
