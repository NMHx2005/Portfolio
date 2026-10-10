import type { Locale } from "@/lib/i18n/config";

// Kept apart from the dictionaries: the 404 page is a client component, and importing a full
// dictionary there would ship both languages' content to every visitor.
export const notFoundCopy: Record<Locale, { title: string; text: string; cta: string }> = {
  vi: {
    title: "Không tìm thấy trang",
    text: "Đường dẫn này không tồn tại hoặc đã được chuyển đi.",
    cta: "Về trang chủ",
  },
  en: {
    title: "Page not found",
    text: "This link doesn't exist or has moved.",
    cta: "Back to home",
  },
};
