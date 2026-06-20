import { useEffect, useState } from "react";

export function useTypewriter(
  text = "",
  { enabled = false, charMs = 16, startDelayMs = 450, chunkSize = 2 } = {},
) {
  const [displayed, setDisplayed] = useState(enabled ? "" : text);
  const [done, setDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setDone(true);
      return undefined;
    }

    if (!text) {
      setDisplayed("");
      setDone(true);
      return undefined;
    }

    setDisplayed("");
    setDone(false);

    let index = 0;
    let tickTimeoutId;
    const startTimeoutId = setTimeout(() => {
      const tick = () => {
        if (index >= text.length) {
          setDisplayed(text);
          setDone(true);
          return;
        }

        const nextChunk =
          text[index] === "\n" ? 1 : Math.min(chunkSize, text.length - index);
        index += nextChunk;
        setDisplayed(text.slice(0, index));
        tickTimeoutId = setTimeout(tick, charMs);
      };

      tick();
    }, startDelayMs);

    return () => {
      clearTimeout(startTimeoutId);
      clearTimeout(tickTimeoutId);
    };
  }, [text, enabled, charMs, startDelayMs, chunkSize]);

  return { displayed, done };
}
