import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader } from "@/components/section-header";
import type { AboutContent, Locale } from "@/content";
import { cn } from "@/lib/utils";

const labels: Record<
    Locale,
    {
        values: string;
        mission: string;
        capabilities: string;
        certifications: string;
    }
> = {
    en: {
        values: "Values I live by",
        mission: "Guiding mission",
        capabilities: "Core capabilities",
        certifications: "Certifications",
    },
    vi: {
        values: "Giá trị tôi theo đuổi",
        mission: "Sứ mệnh nghề nghiệp",
        capabilities: "Năng lực chủ đạo",
        certifications: "Chứng chỉ",
    },
};

export function AboutSection({
    content,
    locale,
}: {
    content: AboutContent;
    locale: Locale;
}) {
    const copy = labels[locale];

    return (
        <AnimatedSection id="about">
            <SectionHeader
                eyebrow={content.eyebrow}
                title={content.headline}
                description={content.story}
            />
            <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-[1.2fr_1fr]">
                <div className="space-y-8 sm:space-y-10">
                    <motion.div
                        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background/90 via-background/80 to-background/90 p-6 shadow-[0_8px_32px_-8px_rgba(124,58,237,0.2),0_0_0_1px_rgba(124,58,237,0.1)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_12px_48px_-12px_rgba(124,58,237,0.3),0_0_0_1px_rgba(124,58,237,0.15)] sm:rounded-[28px] sm:p-7 md:rounded-[32px] md:p-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="relative space-y-4 sm:space-y-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm">
                                {copy.mission}
                            </h3>
                            <p className="text-base leading-relaxed text-foreground sm:text-lg lg:text-xl">
                                {content.mission}
                            </p>
                            <div className="grid gap-2.5 pt-2 sm:gap-3">
                                {content.values.map((value, idx) => (
                                    <motion.div
                                        key={value}
                                        className="flex items-center gap-2.5 rounded-full border border-border/50 bg-background/90 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-secondary/50 hover:bg-background hover:text-foreground sm:gap-3 sm:px-5 sm:py-2.5 sm:text-sm"
                                        initial={{ opacity: 0, x: -12 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: idx * 0.05,
                                            ease: "easeOut",
                                        }}
                                        viewport={{ once: true, amount: 0.2 }}
                                    >
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary/60 opacity-75" />
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(20,184,166,0.4)]" />
                                        </span>
                                        {value}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                    <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground sm:mb-6 sm:text-sm">
                            {copy.capabilities}
                        </h3>
                        <div className="grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-2">
                            {content.skills.map((column, colIdx) => (
                                <motion.div
                                    key={column.category}
                                    className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border/50 bg-background/80 p-5 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-[0_8px_32px_-8px_rgba(124,58,237,0.15)] sm:rounded-[28px] sm:gap-5 sm:p-6 md:rounded-[32px]"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: colIdx * 0.05,
                                        ease: [0.23, 1, 0.32, 1],
                                    }}
                                    viewport={{ once: true, amount: 0.2 }}
                                >
                                    <h4 className="text-base font-bold text-foreground sm:text-lg">
                                        {column.category}
                                    </h4>
                                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                        {column.items.map((item, itemIdx) => (
                                            <motion.span
                                                key={item}
                                                className="rounded-full border border-border/50 bg-background/90 px-3 py-1 text-[10px] font-semibold text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary sm:px-3.5 sm:py-1.5 sm:text-xs"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{
                                                    duration: 0.2,
                                                    delay: colIdx * 0.05 + itemIdx * 0.01,
                                                }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {item}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-5 sm:space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm">
                        {copy.certifications}
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                        {content.certifications.map((cert, index) => (
                            <motion.div
                                key={cert.name}
                                className={cn(
                                    "group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background/90 via-background/80 to-background/90 p-5 shadow-[0_4px_24px_-4px_rgba(124,58,237,0.15)] backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-[0_8px_32px_-8px_rgba(124,58,237,0.25)] sm:rounded-[28px] sm:p-6 md:rounded-[32px]",
                                )}
                                initial={{ opacity: 0, x: 24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                    ease: [0.23, 1, 0.32, 1],
                                }}
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="relative">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary sm:text-xs">
                                        {cert.year}
                                    </p>
                                    <h4 className="mt-2 text-lg font-bold text-foreground sm:mt-3 sm:text-xl">
                                        {cert.name}
                                    </h4>
                                    <p className="mt-1.5 text-xs font-medium text-muted-foreground sm:mt-2 sm:text-sm">
                                        {cert.issuer}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}


