import Image from "next/image";
import { DeviceFrame } from "@/components/ui/device-frame";
import type { ProjectImage } from "@/content/projects";
import { delay } from "@/lib/css-vars";

export function Gallery({ images, alts }: { images: ProjectImage[]; alts: string[] }) {
  return (
    <div data-motion-sequence className="grid gap-6 sm:grid-cols-2">
      {images.map((image, index) => {
        const picture = (
          <Image
            src={image.src}
            alt={alts[index] ?? ""}
            width={image.width}
            height={image.height}
            sizes={image.frame === "phone" ? "208px" : "(min-width: 1152px) 1088px, 100vw"}
            className="h-auto w-full"
          />
        );
        return image.frame === "phone" ? (
          <figure key={image.src} data-reveal style={delay(index % 2)}>
            <DeviceFrame>{picture}</DeviceFrame>
          </figure>
        ) : (
          <figure
            key={image.src}
            data-reveal
            style={delay(index % 2)}
            className="overflow-hidden border border-border bg-surface sm:col-span-2"
          >
            {picture}
          </figure>
        );
      })}
    </div>
  );
}
