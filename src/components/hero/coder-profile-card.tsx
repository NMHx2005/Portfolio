import type { HeroContent } from "@/content";

interface CoderProfileCardProps {
  hero: Pick<HeroContent, "name" | "role" | "location" | "codeProfile">;
}

export function CoderProfileCard({ hero }: CoderProfileCardProps) {
  const { name, role, location, codeProfile } = hero;

  return (
    <div className="mx-auto w-full min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-slate-100/90 via-white/70 to-slate-200/80 shadow-[0_20px_60px_-20px_rgba(37,99,235,0.35)] backdrop-blur dark:border-zinc-800/80 dark:from-[#050216] dark:via-[#0b1036] dark:to-[#0f1c46] dark:shadow-[0_20px_60px_-24px_rgba(124,58,237,0.45)] sm:rounded-3xl sm:shadow-[0_40px_120px_-40px_rgba(37,99,235,0.45)] dark:sm:shadow-[0_40px_120px_-48px_rgba(124,58,237,0.55)]">
      <div className="flex">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-400 to-fuchsia-500 dark:via-fuchsia-500" />
        <div className="h-[2px] w-full bg-gradient-to-r from-fuchsia-500 to-transparent" />
      </div>

      <div className="flex min-w-0 items-center justify-between gap-3 bg-slate-200/70 px-4 py-3 dark:bg-[#040414] sm:px-5 sm:py-4 md:px-6 md:py-4">
        <div className="flex shrink-0 items-center space-x-2 sm:space-x-2.5">
          <span className="h-3 w-3 rounded-full bg-red-500 sm:h-3.5 sm:w-3.5" />
          <span className="h-3 w-3 rounded-full bg-amber-400 sm:h-3.5 sm:w-3.5" />
          <span className="h-3 w-3 rounded-full bg-emerald-400 sm:h-3.5 sm:w-3.5" />
        </div>
        <span className="min-w-0 truncate font-mono text-xs text-slate-600 dark:text-slate-400 sm:text-sm md:text-base">
          {codeProfile.fileName}
        </span>
      </div>

      <div className="relative min-w-0 overflow-x-auto border-t border-slate-200/70 px-4 py-4 dark:border-slate-800 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <div className="pointer-events-none absolute -top-12 -left-12 h-32 w-32 rounded-full bg-sky-500/30 blur-2xl dark:bg-indigo-400/30 sm:-top-16 sm:-left-16 sm:h-40 sm:w-40 sm:blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-20 h-40 w-40 rounded-full bg-pink-500/20 blur-[80px] sm:-bottom-20 sm:-right-24 sm:h-48 sm:w-48 sm:blur-[110px]" />

        <div className="relative flex min-w-0">
          <div className="hidden shrink-0 select-none pr-3 font-mono text-xs leading-relaxed text-slate-600/80 dark:text-slate-500/70 sm:flex sm:flex-col sm:items-end sm:pr-4 sm:text-sm md:pr-5 md:text-base">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} className="leading-relaxed">
                {index + 1}
              </span>
            ))}
          </div>

          <code className="min-w-0 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-200 sm:text-sm sm:leading-relaxed md:text-base lg:text-lg xl:text-xl">
            <span className="mr-1 sm:mr-2 text-fuchsia-600 dark:text-fuchsia-400">
              const
            </span>
            <span className="mr-1 sm:mr-2 text-indigo-600 dark:text-indigo-300">
              profile
            </span>
            <span className="mr-1 sm:mr-2 text-fuchsia-600 dark:text-fuchsia-400">=</span>
            <span className="text-slate-600 dark:text-slate-400">&#123;</span>
            <br />
            <Indent>
              <Line label="name" value={name} />
              <Line label="role" value={role} />
              <Line label="seniority" value={codeProfile.seniority} />
              <Line label="location" value={location} />
              <span className="text-slate-800 dark:text-white">
                skills
                <span className="text-slate-600 dark:text-slate-400">: [</span>
              </span>
              <div className="min-w-0 pl-4 sm:pl-5 md:pl-6">
                {codeProfile.skills.map((skill, index) => (
                  <span key={skill} className="mr-1.5 inline-block break-words sm:whitespace-nowrap">
                    <span className="text-slate-600 dark:text-slate-400">&#39;</span>
                    <span className="text-cyan-600 dark:text-cyan-300">
                      {skill}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">&#39;</span>
                    {index < codeProfile.skills.length - 1 ? (
                      <span className="text-slate-600 dark:text-slate-400">
                        ,{" "}
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
              <span className="text-slate-600 dark:text-slate-400">
                ],
              </span>
            </Indent>
            <span className="text-slate-600 dark:text-slate-400">&#125;;</span>
          </code>
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-between gap-2 border-t border-slate-200/80 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500 sm:px-5 sm:py-3 sm:text-sm md:px-6 md:py-3.5 md:text-base lg:px-8">
        <span className="truncate text-xs sm:text-sm md:text-base">UTF-8</span>
        <span className="truncate px-2 text-xs sm:px-3 sm:text-sm md:text-base">TypeScript</span>
        <span className="truncate text-xs sm:text-sm md:text-base">Ln 15, Col 2</span>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 pl-4 sm:pl-5 md:pl-6">
      <span className="text-slate-800 dark:text-white">{label}:</span>{" "}
      <span className="text-slate-600 dark:text-slate-400">&#39;</span>
      <span className="break-words text-emerald-600 dark:text-emerald-300">
        {value.replace(/'/g, "")}
      </span>
      <span className="text-slate-600 dark:text-slate-400">&#39;,</span>
    </div>
  );
}

function Indent({ children }: { children: React.ReactNode }) {
  return <div className="min-w-0 pl-4 sm:pl-5 md:pl-6">{children}</div>;
}

