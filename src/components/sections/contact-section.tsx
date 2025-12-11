"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader } from "@/components/section-header";
import type { ContactSection as ContactSectionContent, Locale } from "@/content";
import { cn } from "@/lib/utils";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas";

const labels: Record<
  Locale,
  {
    eyebrow: string;
    submit: string;
    success: string;
    error: string;
    required: string;
  }
> = {
  en: {
    eyebrow: "Contact",
    submit: "Send message",
    success: "Thanks for reaching out! I'll respond within two business days.",
    error: "Something went wrong. Please try again or email me directly.",
    required: "Required",
  },
  vi: {
    eyebrow: "Liên hệ",
    submit: "Gửi tin nhắn",
    success: "Cảm ơn bạn đã chia sẻ! Tôi sẽ phản hồi trong 2 ngày làm việc.",
    error: "Có lỗi xảy ra. Vui lòng thử lại hoặc email trực tiếp cho tôi.",
    required: "Bắt buộc",
  },
};

const formLabels: Record<
  Locale,
  {
    name: string;
    email: string;
    company: string;
    timeline: string;
    overview: string;
    availability: string;
    social: string;
  }
> = {
  en: {
    name: "Name",
    email: "Email",
    company: "Company / Team",
    timeline: "Timeline",
    overview: "Project overview",
    availability: "Availability",
    social: "Social",
  },
  vi: {
    name: "Họ tên",
    email: "Email",
    company: "Công ty / Nhóm",
    timeline: "Thời gian",
    overview: "Tổng quan dự án",
    availability: "Khả năng nhận việc",
    social: "Kết nối",
  },
};

export function ContactSection({
  locale,
  content,
}: {
  locale: Locale;
  content: ContactSectionContent;
}) {
  const copy = labels[locale];
  const field = formLabels[locale];
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed request");
      }

      setStatus("success");
      reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <AnimatedSection id="contact">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={content.headline}
        description={content.description}
      />
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="group relative space-y-6 overflow-hidden rounded-[40px] border border-border/50 bg-gradient-to-br from-background/90 via-background/80 to-background/90 p-8 shadow-[0_8px_32px_-8px_rgba(124,58,237,0.2),0_0_0_1px_rgba(124,58,237,0.1)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_12px_48px_-12px_rgba(124,58,237,0.3),0_0_0_1px_rgba(124,58,237,0.15)] lg:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label={field.name}
              error={errors.name?.message}
              requiredLabel={copy.required}
            >
              <input
                {...register("name")}
                placeholder="Jane Doe"
                className="field-input"
                autoComplete="name"
              />
            </Field>
            <Field
              label={field.email}
              error={errors.email?.message}
              requiredLabel={copy.required}
            >
              <input
                {...register("email")}
                type="email"
                placeholder="hello@example.com"
                className="field-input"
                autoComplete="email"
              />
            </Field>
            <Field
              label={field.company}
              error={errors.company?.message}
              requiredLabel={copy.required}
            >
              <input
                {...register("company")}
                placeholder="Your product team"
                className="field-input"
              />
            </Field>
            <Field
              label={field.timeline}
              error={errors.timeline?.message}
              requiredLabel={copy.required}
            >
              <input
                {...register("timeline")}
                placeholder="Kick-off in February 2026"
                className="field-input"
              />
            </Field>
          </div>
          <Field
            label={field.overview}
            error={errors.message?.message}
            requiredLabel={copy.required}
          >
            <textarea
              {...register("message")}
              placeholder="What challenge are you solving? What does success look like?"
              className="field-input min-h-[160px] resize-none"
            />
          </Field>
          <motion.button
            type="submit"
            className={cn(
              "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-primary to-primary/90 px-8 text-sm font-bold text-primary-foreground shadow-[0_4px_20px_-4px_rgba(124,58,237,0.5),0_0_0_1px_rgba(124,58,237,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-6px_rgba(124,58,237,0.6),0_0_0_1px_rgba(124,58,237,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 sm:h-14",
              status === "loading" && "pointer-events-none opacity-80",
            )}
            whileTap={{ scale: 0.97 }}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              <>
                {copy.submit}
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </motion.button>
          {status === "success" ? (
            <motion.p
              className="flex items-center gap-2 text-sm font-semibold text-emerald-500"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {copy.success}
            </motion.p>
          ) : null}
          {status === "error" ? (
            <motion.p
              className="flex items-center gap-2 text-sm font-semibold text-red-500"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {copy.error}
            </motion.p>
          ) : null}
          </div>
        </motion.form>
        <motion.div
          className="group relative space-y-8 overflow-hidden rounded-[40px] border border-border/50 bg-gradient-to-br from-background/90 via-background/80 to-background/90 p-8 shadow-[0_4px_24px_-4px_rgba(124,58,237,0.15)] backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-[0_8px_32px_-8px_rgba(124,58,237,0.25)] lg:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative space-y-8">
          <p className="text-base text-muted-foreground">{content.content.intro}</p>
          <div className="space-y-3 rounded-2xl border border-border/50 bg-background/60 p-5 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {field.availability}
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {content.content.availability}
            </p>
          </div>
          <div className="grid gap-4">
            <ContactLink
              label={field.email}
              value={content.content.email}
              href={`mailto:${content.content.email}`}
            />
            <ContactLink
              label={locale === "en" ? "Phone" : "Điện thoại"}
              value={content.content.phone}
              href={`tel:${content.content.phone.replace(/[^0-9+]/g, "")}`}
            />
            <ContactLink
              label={locale === "en" ? "Location" : "Khu vực"}
              value={content.content.location}
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {field.social}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {content.content.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/90 px-4 py-2.5 text-sm font-semibold text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                  >
                    {social.label}
                    <svg
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function Field({
  label,
  error,
  children,
  requiredLabel,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  requiredLabel: string;
}) {
  return (
    <label className="flex flex-col gap-2.5">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
        <span className="text-primary">{requiredLabel}</span>
      </span>
      {children}
      {error ? (
        <motion.span
          className="flex items-center gap-1.5 text-xs font-semibold text-red-500"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </motion.span>
      ) : null}
    </label>
  );
}

function ContactLink({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="inline-flex items-center gap-3 rounded-full border border-border/50 bg-background/90 px-5 py-3 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-foreground">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-semibold">{value}</span>
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group/link inline-flex transition-transform duration-300 hover:-translate-y-0.5"
      >
        {content}
      </a>
    );
  }

  return content;
}


