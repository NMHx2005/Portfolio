import { buildingData, buildingSlugs } from "@/content/projects";
import type { Dictionary } from "@/content/types";
import { delay } from "@/lib/css-vars";

export function BuildingList({ dict }: { dict: Dictionary }) {
  const { building } = dict.work;

  return (
    <div className="mt-24 md:mt-32">
      <h3 id="building-heading" data-reveal className="max-w-3xl text-balance text-2xl font-semibold tracking-tight">
        {building.heading}
      </h3>
      <p data-reveal style={delay(1)} className="mt-3 max-w-2xl text-pretty text-fg-muted">
        {building.lede}
      </p>
      <ul id="building" aria-labelledby="building-heading" className="mt-10 divide-y divide-border border-y border-border">
        {buildingSlugs.map((slug, index) => {
          const item = building.items[slug];
          return (
            <li
              key={slug}
              data-reveal
              style={delay(index)}
              className="grid gap-3 py-6 md:grid-cols-[12rem_1fr_10rem] md:gap-8"
            >
              <h4 className="text-lg font-semibold tracking-tight">{item.title}</h4>
              <p className="text-pretty text-fg-muted">{item.summary}</p>
              <p className="text-sm text-fg-subtle md:text-right">{dict.work.statusLabels[buildingData[slug].status]}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
