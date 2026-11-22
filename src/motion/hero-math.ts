export const STRIP_BASE_SPEED = 40; // px per second
export const STRIP_MAX_BOOST = 3; // extra multiples of the base speed a fast scroll can add
const VELOCITY_FOR_MAX_BOOST = 3000; // px per second of page scroll

const clamp01 = (value: number) => (Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0);

// Scrolling either way speeds the strip up, bounded so a hard flick never makes it unreadable.
export function stripSpeed(scrollVelocity: number): number {
  return STRIP_BASE_SPEED * (1 + STRIP_MAX_BOOST * clamp01(Math.abs(scrollVelocity) / VELOCITY_FOR_MAX_BOOST));
}

// Exponential approach, independent of frame rate: how the speed eases back to the base after a flick.
export function approach(current: number, target: number, seconds: number, timeConstant = 0.6): number {
  return current + (target - current) * (1 - Math.exp(-Math.max(0, seconds) / timeConstant));
}

export function wrapOffset(offset: number, loop: number): number {
  return loop > 0 ? ((offset % loop) + loop) % loop : 0;
}

export function countValue(target: number, progress: number): number {
  return Math.min(target, Math.round(target * clamp01(progress)));
}
