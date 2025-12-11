import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    align?: "left" | "center";
}

export function SectionHeader({
    eyebrow,
    title,
    description,
    align = "left",
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                "mb-16 flex flex-col gap-4 lg:mb-20",
                align === "center" && "items-center text-center",
            )}
        >
            {eyebrow ? (
                <motion.span
                    className="inline-flex w-max items-center gap-2.5 rounded-full border border-border/50 bg-background/90 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md"
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                    viewport={{ once: true }}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {eyebrow}
                </motion.span>
            ) : null}
            <motion.h2
                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                viewport={{ once: true }}
            >
                {title}
            </motion.h2>
            {description ? (
                <motion.p
                    className="max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    viewport={{ once: true }}
                >
                    {description}
                </motion.p>
            ) : null}
        </div>
    );
}


