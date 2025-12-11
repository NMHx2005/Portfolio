import { z } from "zod";

export const contactFormSchema = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    company: z.string().min(2).max(120),
    timeline: z.string().min(2).max(120),
    message: z.string().min(10).max(1000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;


