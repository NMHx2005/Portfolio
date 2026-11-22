export type Theme = "dark" | "light";

export const themeStorageKey = "theme";

// Runs in <head> before first paint. The server renders `dark` (the default); a visitor who chose light has
// the class removed here, so there is no flash. It must stay a plain string: it is inlined, not bundled.
export const themeInitScript = `try{if(localStorage.getItem("${themeStorageKey}")==="light")document.documentElement.classList.remove("dark")}catch(e){}`;

let latestSwap = 0;

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const swap = () => root.classList.toggle("dark", theme === "dark");

  if (typeof document.startViewTransition === "function" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // The browser cross-fades old and new page (see ::view-transition-* in globals.css). The class keeps that long
    // fade from also applying to the route changes, which run in view transitions as well.
    root.classList.add("theme-swap");
    // A newer toggle skips this transition; its end must not strip the class from the one that replaced it.
    const mine = ++latestSwap;
    const done = () => {
      if (mine === latestSwap) root.classList.remove("theme-swap");
    };
    document.startViewTransition(swap).finished.then(done, done);
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
