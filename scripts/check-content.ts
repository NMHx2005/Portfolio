import { existsSync } from "node:fs";
import { join } from "node:path";
import { siteConfig } from "../src/config/site";
import { getDictionary } from "../src/content/dictionary";
import { projectSlugs, projectsData } from "../src/content/projects";
import { findContentGaps } from "./content-gaps";

const dict = getDictionary("vi");

const gaps = findContentGaps(
  {
    email: siteConfig.contact.email,
    portrait: siteConfig.portrait,
    cv: siteConfig.contact.cv,
    projects: projectSlugs.map((slug) => ({
      slug,
      hasRole: Boolean(dict.work.items[slug].role),
      links: projectsData[slug].links,
    })),
  },
  (publicPath) => existsSync(join(process.cwd(), "public", publicPath)),
);

if (gaps.length === 0) {
  console.log("All owner inputs are provided.");
} else {
  console.log(`${gaps.length} optional owner input(s) still missing (pages render without them):`);
  for (const gap of gaps) console.log(` - ${gap.message}`);
}
