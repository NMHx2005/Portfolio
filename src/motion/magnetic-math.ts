export const MAGNETIC_MAX = 12;

// `dx`/`dy` are the pointer's distance from the element's resting centre. Inside the box the pull grows to the cap at
// the edge; outside it is zero, so the element lets go as soon as the pointer is no longer over its resting place.
export function magneticPull(dx: number, dy: number, width: number, height: number): { x: number; y: number } {
  const halfW = width / 2;
  const halfH = height / 2;
  if (!(halfW > 0 && halfH > 0) || Math.abs(dx) > halfW || Math.abs(dy) > halfH) return { x: 0, y: 0 };
  return { x: (dx / halfW) * MAGNETIC_MAX, y: (dy / halfH) * MAGNETIC_MAX };
}
