// The fixed site header.
export const PIN_HEADER = 64;
// The position indicator sits in this band between the header and the pinned stage.
export const PIN_INDICATOR_BAND = 40;

// The pinned range is split into `count` equal stretches (the pin is one viewport long per project), and item k owns
// stretch k: it comes on at exactly k / count.
export function activeIndex(progress: number, count: number): number {
  if (count < 2 || Number.isNaN(progress)) return 0;
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}

export function formatIndicator(index: number, count: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.min(count, Math.max(1, index + 1)))} / ${pad(count)}`;
}

const room = (viewportHeight: number) => viewportHeight - PIN_HEADER - PIN_INDICATOR_BAND;

export function stageFits(stageHeight: number, viewportHeight: number): boolean {
  return stageHeight > 0 && stageHeight <= room(viewportHeight);
}

// Where the top of the pinned stage sits in the viewport: centred in the room that is left.
export function stageTop(stageHeight: number, viewportHeight: number): number {
  return PIN_HEADER + PIN_INDICATOR_BAND + Math.max(0, Math.floor((room(viewportHeight) - stageHeight) / 2));
}

// The middle of the stretch of item `index`: as far from either change as it gets.
export function scrollForIndex(start: number, end: number, index: number, count: number): number {
  return count < 2 ? start : start + ((end - start) * (index + 0.5)) / count;
}
