export type Theme = "dark" | "light";

export const themeStorageKey = "theme";

// Runs in <head> before first paint. The server renders `dark` (the default); a visitor who chose light has
// the class removed here, so there is no flash. It must stay a plain string: it is inlined, not bundled.
export const themeInitScript = `try{if(localStorage.getItem("${themeStorageKey}")==="light")document.documentElement.classList.remove("dark")}catch(e){}`;

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const swap = () => root.classList.toggle("dark", theme === "dark");

  if (typeof document.startViewTransition === "function" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // The browser cross-fades old and new page (see ::view-transition-* in globals.css).
    document.startViewTransition(swap);
  } else {
    // Without it, switching the class would animate every colour at once; suspend transitions for that frame.
    const style = document.createElement("style");
    style.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(style);
    swap();
    void getComputedStyle(root).opacity;
    window.setTimeout(() => style.remove(), 1);
  }
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage can be blocked; the choice then lasts until the page is closed.
  }
}
