export type CopyResult = "copied" | "failed" | "stale";

/**
 * Writes `text` and reports the outcome. `isCurrent` is asked once the write settles: if the
 * context that started the copy (for example one palette session) is gone, the result is "stale"
 * and the caller must not touch the UI.
 */
export async function copyText(
  text: string,
  write: (text: string) => Promise<void>,
  isCurrent: () => boolean,
): Promise<CopyResult> {
  let result: CopyResult;
  try {
    await write(text); // also catches a synchronous throw when the Clipboard API is unavailable
    result = "copied";
  } catch {
    result = "failed";
  }
  return isCurrent() ? result : "stale";
}
