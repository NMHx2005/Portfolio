import { Fragment } from "react";

/**
 * Renders a headline word by word so each word can slide up out of its own mask (see `.word` in globals.css).
 * The spaces stay real text nodes, so wrapping, copy/paste and screen readers see the ordinary sentence.
 */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return words.map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      <span className="word-mask">
        <span className="word" style={{ "--w": index } as React.CSSProperties}>
          {word}
        </span>
      </span>
      {index < words.length - 1 ? " " : null}
    </Fragment>
  ));
}
