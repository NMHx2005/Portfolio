import { getContactFormConfig } from "@/lib/contact/config";
import { createContactHandler } from "@/lib/contact/handler";

export const POST = createContactHandler(getContactFormConfig, fetch);
