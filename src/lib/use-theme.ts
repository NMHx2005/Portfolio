"use client";

import { useSyncExternalStore } from "react";
import { applyTheme, themeStorageKey, type Theme } from "@/lib/theme";

function subscribe(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  // Another tab changed the choice: follow it.
  function onStorage(event: StorageEvent) {
    if (event.key !== themeStorageKey) return;
    document.documentElement.classList.toggle("dark", event.newValue !== "light");
  }
  window.addEventListener("storage", onStorage);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}

const read = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");
const serverTheme = (): Theme => "dark";

export function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void } {
  return { theme: useSyncExternalStore(subscribe, read, serverTheme), setTheme: applyTheme };
}
