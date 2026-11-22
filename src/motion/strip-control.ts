// The visitor's pause of the hero strip (WCAG 2.2.2). It is kept apart from the automatic holds (pointer, focus,
// visibility): those come and go by themselves, the visitor's pause ends only when the visitor says so.

export interface StripHolds {
  hovering: boolean;
  focused: boolean;
  inView: boolean;
  documentHidden: boolean;
}

export function stripHeld(userPaused: boolean, holds: StripHolds): boolean {
  return userPaused || holds.hovering || holds.focused || !holds.inView || holds.documentHidden;
}

// What the control needs of the button, so that a plain object can stand in for it in tests.
export interface PauseButton {
  hidden: boolean;
  setAttribute(name: string, value: string): void;
  addEventListener(type: "click", listener: () => void): void;
  removeEventListener(type: "click", listener: () => void): void;
}

export interface PauseControl {
  isPaused(): boolean;
  // Hides the button again and puts back the pressed state the server markup had.
  release(): void;
}

// The server renders the button hidden, with one fixed accessible name; `aria-pressed` alone carries the state (true =
// paused). Changing the name as well would announce "Play, pressed", the opposite of the state. The button is shown
// only once the strip is moving on its own.
export function createPauseControl(button: PauseButton): PauseControl {
  let paused = false;
  const apply = () => button.setAttribute("aria-pressed", String(paused));
  const onClick = () => {
    paused = !paused;
    apply();
  };

  button.addEventListener("click", onClick);
  apply();
  button.hidden = false;
  return {
    isPaused: () => paused,
    release() {
      button.removeEventListener("click", onClick);
      paused = false;
      apply();
      button.hidden = true;
    },
  };
}
