"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Turnstile, type TurnstileHandle } from "@/components/turnstile";
import type { ContactField, ContactFormCopy, ContactKind } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import { CONTACT_KIND_EVENT, takePendingContactKind } from "@/lib/contact/preselect";
import { contactKinds, HONEYPOT_FIELD, parseContactRequest } from "@/lib/contact/schema";

const REQUEST_TIMEOUT_MS = 20_000;

const control =
  "mt-2 block min-h-11 w-full border border-border-strong bg-surface px-3 py-2 text-base text-fg placeholder:text-fg-subtle aria-[invalid=true]:border-fg";

function isContactKind(value: unknown): value is ContactKind {
  return contactKinds.some((kind) => kind === value);
}

function isContactField(value: unknown, copy: ContactFormCopy): value is ContactField {
  return typeof value === "string" && Object.hasOwn(copy.invalid, value);
}

// Only a 400 that names fields is something the visitor can fix; every other outcome gets the generic failure.
function invalidFields(status: number, body: unknown, copy: ContactFormCopy): ContactField[] {
  const fields = typeof body === "object" && body !== null ? (body as { fields?: unknown }).fields : null;
  if (status !== 400 || !Array.isArray(fields)) return [];
  return fields.filter((field): field is ContactField => isContactField(field, copy));
}

interface ContactFormProps {
  locale: Locale;
  copy: ContactFormCopy;
  siteKey: string;
  scriptUrl: string;
}

export function ContactForm({ locale, copy, siteKey, scriptUrl }: ContactFormProps) {
  const [kind, setKind] = useState<ContactKind | "">("");
  const [errors, setErrors] = useState<ContactField[]>([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<"success" | "failure" | null>(null);
  const turnstile = useRef<TurnstileHandle>(null);
  // Before hydration (or without JavaScript) a native submit would be a GET that puts the request into the URL.
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const focusAfterRender = useRef<ContactField | null>(null);
  // State updates are asynchronous, so a second click in the same tick would still see `sending === false`.
  const inFlight = useRef(false);

  useEffect(() => {
    function onKind(event: Event) {
      if (!(event instanceof CustomEvent) || !isContactKind(event.detail)) return;
      event.preventDefault(); // tells the sender that a form took the choice
      setKind(event.detail);
    }
    window.addEventListener(CONTACT_KIND_EVENT, onKind);
    // A link on another page chose before this form existed.
    const pending = takePendingContactKind();
    if (pending) onKind(new CustomEvent(CONTACT_KIND_EVENT, { detail: pending, cancelable: true }));
    return () => window.removeEventListener(CONTACT_KIND_EVENT, onKind);
  }, []);

  // Focus moves once the messages are in the DOM, so a screen reader reads the field together with its error.
  useEffect(() => {
    if (focusAfterRender.current === null) return;
    document.getElementById(`contact-${focusAfterRender.current}`)?.focus();
    focusAfterRender.current = null;
  }, [errors]);

  function showErrors(fields: ContactField[]) {
    focusAfterRender.current = fields[0] ?? null;
    setErrors(fields);
    setResult(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "");
    const payload = {
      name: text("name"),
      company: text("company"),
      reply: text("reply"),
      kind: text("kind"),
      message: text("message"),
      timeline: text("timeline"),
      locale,
      [HONEYPOT_FIELD]: text(HONEYPOT_FIELD),
    };

    // The server validates again; this check only saves the visitor a round trip.
    const parsed = parseContactRequest(payload);
    if (!parsed.ok && "fields" in parsed && parsed.fields.length > 0) return showErrors(parsed.fields);

    inFlight.current = true;
    setSending(true);
    setErrors([]);
    setResult(null);
    try {
      // A visitor can submit before the challenge has produced a token; the button stays in "sending" meanwhile.
      const token = await turnstile.current?.getToken();
      if (!token) {
        setResult("failure");
        return;
      }
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, token }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const body: unknown = await res.json().catch(() => null);
      if (res.ok && typeof body === "object" && body !== null && (body as { ok?: unknown }).ok === true) {
        form.reset();
        setKind("");
        setResult("success");
        return;
      }
      const fields = invalidFields(res.status, body, copy);
      if (fields.length > 0) showErrors(fields);
      else setResult("failure");
    } catch {
      setResult("failure");
    } finally {
      turnstile.current?.reset();
      inFlight.current = false;
      setSending(false);
    }
  }

  function field(name: ContactField, extra: { required?: boolean } = {}) {
    const invalid = errors.includes(name);
    return {
      id: `contact-${name}`,
      name,
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? `contact-${name}-error` : undefined,
      "aria-required": extra.required || undefined,
      className: control,
    };
  }

  function label(name: ContactField) {
    return (
      <label htmlFor={`contact-${name}`} className="text-sm text-fg-muted">
        {copy.fields[name]}
      </label>
    );
  }

  function error(name: ContactField) {
    return errors.includes(name) ? (
      <p id={`contact-${name}-error`} className="mt-2 text-sm text-fg">
        {copy.invalid[name]}
      </p>
    ) : null;
  }

  return (
    <form
      method="post"
      onSubmit={onSubmit}
      onInput={(event) => {
        const name = event.target instanceof HTMLElement ? event.target.getAttribute("name") : null;
        setErrors((current) => current.filter((invalid) => invalid !== name));
      }}
      noValidate
      className="relative mt-14 border-t border-border pt-10"
    >
      <h3 className="text-xl font-semibold tracking-tight">{copy.title}</h3>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          {label("name")}
          <input type="text" autoComplete="name" {...field("name", { required: true })} />
          {error("name")}
        </div>
        <div>
          {label("company")}
          <input type="text" autoComplete="organization" {...field("company")} />
          {error("company")}
        </div>
        <div className="md:col-span-2">
          {label("reply")}
          <input type="text" autoComplete="off" {...field("reply", { required: true })} />
          {error("reply")}
        </div>
        <div className="md:col-span-2">
          {label("kind")}
          <select
            {...field("kind", { required: true })}
            value={kind}
            onChange={(event) => setKind(isContactKind(event.target.value) ? event.target.value : "")}
          >
            <option value="">{copy.kindPrompt}</option>
            {contactKinds.map((value) => (
              <option key={value} value={value}>
                {copy.kinds[value]}
              </option>
            ))}
          </select>
          {error("kind")}
        </div>
        <div className="md:col-span-2">
          {label("message")}
          <textarea rows={6} placeholder={copy.placeholders.message} {...field("message", { required: true })} />
          {error("message")}
        </div>
        <div className="md:col-span-2">
          {label("timeline")}
          <input type="text" autoComplete="off" placeholder={copy.placeholders.timeline} {...field("timeline")} />
          {error("timeline")}
        </div>
      </div>

      {/* Honeypot: off-screen rather than display:none or hidden, because bots skip fields they can tell are not
          rendered. Real visitors never reach it (no tab stop, hidden from assistive technology). */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <Turnstile ref={turnstile} siteKey={siteKey} scriptUrl={scriptUrl} />

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {/* While sending the button is only aria-disabled: the `disabled` attribute would drop keyboard focus. The submit
            handler ignores a second submit, so Enter or a click cannot send twice. */}
        <button
          type="submit"
          disabled={!hydrated}
          aria-disabled={sending || undefined}
          className="inline-flex h-11 items-center justify-center bg-fg px-5 text-sm font-medium text-bg transition-colors duration-200 hover:bg-fg/85 disabled:opacity-60 aria-disabled:opacity-60"
        >
          {sending ? copy.sending : copy.submit}
        </button>
        <p role="status" className={result === "failure" ? "border-l-2 border-fg pl-3 text-sm" : "text-sm"}>
          {result === "success" ? copy.success : result === "failure" ? copy.failure : ""}
        </p>
      </div>
    </form>
  );
}
