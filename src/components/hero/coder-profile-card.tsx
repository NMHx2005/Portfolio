import type { HeroContent } from "@/content";

interface CoderProfileCardProps {
  hero: Pick<HeroContent, "name" | "role" | "location" | "codeProfile">;
}

export function CoderProfileCard({ hero }: CoderProfileCardProps) {
  const { name, role, location, codeProfile } = hero;

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-slate-100/90 via-white/70 to-slate-200/80 shadow-[0_40px_120px_-40px_rgba(37,99,235,0.45)] backdrop-blur dark:border-zinc-800/80 dark:from-[#050216] dark:via-[#0b1036] dark:to-[#0f1c46] dark:shadow-[0_40px_120px_-48px_rgba(124,58,237,0.55)]">
      <div className="flex">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-400 to-fuchsia-500 dark:via-fuchsia-500" />
        <div className="h-[2px] w-full bg-gradient-to-r from-fuchsia-500 to-transparent" />
      </div>

      <div className="flex items-center justify-between bg-slate-200/70 px-5 py-4 dark:bg-[#040414]">
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
          {codeProfile.fileName}
        </span>
      </div>

      <div className="relative border-t border-slate-200/70 px-5 py-6 dark:border-slate-800 lg:px-8 lg:py-8">
        <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-sky-500/30 blur-3xl dark:bg-indigo-400/30" />
        <div className="pointer-events-none absolute -bottom-20 -right-24 h-48 w-48 rounded-full bg-pink-500/20 blur-[110px]" />

        <div className="relative flex">
          <div className="hidden select-none pr-4 font-mono text-xs text-slate-600/80 dark:text-slate-500/70 md:flex md:flex-col md:items-end">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} className="leading-relaxed">
                {index + 1}
              </span>
            ))}
          </div>

          <code className="font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-200 md:text-sm lg:text-base">
            <span className="mr-2 text-fuchsia-600 dark:text-fuchsia-400">
              const
            </span>
            <span className="mr-2 text-indigo-600 dark:text-indigo-300">
              profile
            </span>
            <span className="mr-2 text-fuchsia-600 dark:text-fuchsia-400">=</span>
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
              <div className="pl-6">
                {codeProfile.skills.map((skill, index) => (
                  <span key={skill} className="mr-1 whitespace-nowrap">
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

      <div className="flex items-center justify-between border-t border-slate-200/80 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500 lg:px-8">
        <span>UTF-8</span>
        <span>TypeScript</span>
        <span>Ln 15, Col 2</span>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="pl-6">
      <span className="text-slate-800 dark:text-white">{label}:</span>{" "}
      <span className="text-slate-600 dark:text-slate-400">&#39;</span>
      <span className="text-emerald-600 dark:text-emerald-300">
        {value.replace(/'/g, "")}
      </span>
      <span className="text-slate-600 dark:text-slate-400">&#39;,</span>
    </div>
  );
}

function Indent({ children }: { children: React.ReactNode }) {
  return <div className="pl-6">{children}</div>;
}

