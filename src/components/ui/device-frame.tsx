import type { ReactNode } from "react";

/** A neutral panel for phone captures: the picture keeps its own ratio at a fixed maximum height. */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center border border-border bg-surface py-6 [&_img]:h-auto [&_img]:max-h-[28rem] [&_img]:w-auto">
      {children}
    </div>
  );
}
