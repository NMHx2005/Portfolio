import type { ContactKind } from "@/content/types";
import type { ContactRequest } from "@/lib/contact/schema";

// Fixed strings: no visitor text may reach a header. The reader is the owner, so Vietnamese.
const subjects: Record<ContactKind, string> = {
  web: "Yêu cầu mới từ website: Website",
  webapp: "Yêu cầu mới từ website: Ứng dụng web",
  mobile: "Yêu cầu mới từ website: Ứng dụng di động",
  ai: "Yêu cầu mới từ website: Giải pháp AI",
  other: "Yêu cầu mới từ website: Khác",
};

const kindLabels: Record<ContactKind, string> = {
  web: "Website",
  webapp: "Ứng dụng web",
  mobile: "Ứng dụng di động",
  ai: "Giải pháp AI",
  other: "Khác",
};

export interface ContactEmail {
  subject: string;
  text: string;
  replyTo?: string;
}

// Deliberately conservative ASCII: an address the email API would reject must not
// become a 502, so anything unusual just gets no reply_to (it stays in the body).
const EMAIL =
  /^[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
const MAX_EMAIL_LENGTH = 120;

export function buildContactEmail(req: ContactRequest): ContactEmail {
  const text = [
    `Tên: ${req.name}`,
    `Công ty: ${req.company || "-"}`,
    `Liên hệ lại: ${req.reply}`,
    `Loại việc: ${kindLabels[req.kind]}`,
    `Thời gian mong muốn: ${req.timeline || "-"}`,
    `Ngôn ngữ trang: ${req.locale}`,
    "",
    req.message,
  ].join("\n");
  const email: ContactEmail = { subject: subjects[req.kind], text };
  if (req.reply.length <= MAX_EMAIL_LENGTH && EMAIL.test(req.reply)) email.replyTo = req.reply;
  return email;
}
