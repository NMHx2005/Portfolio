"use client";

import { motion } from "framer-motion";

export function ComingSoonCard({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            className="rounded-3xl border border-border/60 bg-background/80 p-8 text-base text-muted-foreground shadow-[0_32px_90px_-52px_rgba(124,58,237,0.3)] backdrop-blur"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
            {children}
        </motion.div>
    );
}

