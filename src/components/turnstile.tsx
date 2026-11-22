"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from "react";

const SCRIPT_ID = "turnstile-api";
const TOKEN_WAIT_MS = 10_000;

interface TurnstileApi {
  render(
    el: HTMLElement,
    options: {
      sitekey: string;
      appearance: "interaction-only";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
    },
  ): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function loadApi(scriptUrl: string): Promise<TurnstileApi> {
  return new Promise((resolve, reject) => {
    const ready = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile missing")));
    if (window.turnstile) return ready();
    const src = new URL(scriptUrl);
    src.searchParams.set("render", "explicit");
    const script = document.getElementById(SCRIPT_ID) ?? Object.assign(document.createElement("script"), { id: SCRIPT_ID, src: src.href, async: true });
    script.addEventListener("load", ready);
    script.addEventListener("error", () => {
      script.remove(); // the next attempt loads it afresh
      reject(new Error("turnstile blocked"));
    });
    if (!script.isConnected) document.head.append(script);
  });
}

export interface TurnstileHandle {
  /** Resolves with a fresh token, or `null` when the script or widget failed or no token came within the bound. */
  getToken(): Promise<string | null>;
  /** A token is single-use: call after every attempt so the widget issues the next one. */
  reset(): void;
}

interface TurnstileProps {
  siteKey: string;
  scriptUrl: string;
  ref: Ref<TurnstileHandle>;
}

export function Turnstile({ siteKey, scriptUrl, ref }: TurnstileProps) {
  const box = useRef<HTMLDivElement>(null);
  const core = useRef({
    api: null as TurnstileApi | null,
    widget: null as string | null,
    token: null as string | null,
    failed: false,
    started: false,
    alive: false,
    waiters: new Set<(token: string | null) => void>(),
  });

  const settle = useCallback((token: string | null) => {
    const { waiters } = core.current;
    for (const waiter of [...waiters]) waiter(token);
  }, []);

  // Idempotent: loads the script and renders the widget, or after a failure retries whichever step failed.
  const start = useCallback(() => {
    const s = core.current;
    const el = box.current;
    if (!el || !s.alive) return;
    if (s.api && s.widget) {
      if (s.failed) {
        s.failed = false;
        s.api.reset(s.widget);
      }
      return;
    }
    if (s.started) return;
    s.started = true;
    s.failed = false;
    loadApi(scriptUrl)
      .then((api) => {
        if (!s.alive || s.widget) return;
        s.api = api;
        s.widget = api.render(el, {
          sitekey: siteKey,
          appearance: "interaction-only",
          callback: (token) => {
            s.token = token;
            s.failed = false;
            settle(token);
          },
          "error-callback": () => {
            s.token = null;
            s.failed = true;
            settle(null);
          },
          "expired-callback": () => {
            s.token = null;
          },
        });
      })
      .catch(() => {
        s.started = false;
        s.failed = true;
        settle(null);
      });
  }, [siteKey, scriptUrl, settle]);

  useImperativeHandle(
    ref,
    () => ({
      getToken() {
        const s = core.current;
        if (s.token) return Promise.resolve(s.token);
        start();
        return new Promise((resolve) => {
          const done = (token: string | null) => {
            window.clearTimeout(timer);
            s.waiters.delete(done);
            resolve(token);
          };
          const timer = window.setTimeout(() => done(null), TOKEN_WAIT_MS);
          s.waiters.add(done);
        });
      },
      reset() {
        const s = core.current;
        s.token = null;
        if (s.api && s.widget) {
          s.failed = false;
          s.api.reset(s.widget);
        }
      },
    }),
    [start],
  );

  useEffect(() => {
    const s = core.current;
    const el = box.current;
    if (!el) return;
    s.alive = true;
    // The challenge script is third-party weight, so it is only fetched once the form is about to be seen.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        start();
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => {
      s.alive = false;
      observer.disconnect();
      if (s.api && s.widget) s.api.remove(s.widget);
      s.api = null;
      s.widget = null;
      s.token = null;
      s.started = false;
      settle(null);
    };
  }, [start, settle]);

  return <div ref={box} />;
}
