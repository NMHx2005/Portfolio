export interface MotionEnv {
  reducedMotion: boolean;
  finePointer: boolean;
  width: number;
}

export interface MotionProfile {
  smooth: boolean;
  pin: boolean;
  magnetic: boolean;
  strip: boolean;
  count: boolean;
  parallax: boolean;
}

export const PIN_MIN_WIDTH = 1024;

export function motionProfile({ reducedMotion, finePointer, width }: MotionEnv): MotionProfile {
  const motion = !reducedMotion;
  return {
    smooth: motion && finePointer,
    pin: motion && finePointer && width >= PIN_MIN_WIDTH,
    magnetic: motion && finePointer,
    // A coarse pointer keeps the native swipe row: the takeover would remove the only way to move it.
    strip: motion && finePointer,
    count: motion,
    parallax: motion,
  };
}

export function profileNames(profile: MotionProfile): string {
  return Object.entries(profile)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name)
    .join(" ");
}
