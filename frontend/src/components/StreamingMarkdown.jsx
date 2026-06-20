import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTypewriter } from "../hooks/useTypewriter";

const ThinkingDots = () => (
  <span className="inline-flex gap-0.5 ml-0.5" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="inline-block h-1 w-1 rounded-full bg-[#9b9b9b] animate-pulse"
        style={{ animationDelay: `${i * 180}ms` }}
      />
    ))}
  </span>
);

export const ThinkingIndicator = () => (
  <span className="text-[#9b9b9b] italic">
    Thinking
    <ThinkingDots />
  </span>
);

export const StreamingMarkdown = ({
  text,
  stream = false,
  onStreamComplete,
  onStreamTick,
}) => {
  const { displayed, done } = useTypewriter(text, {
    enabled: stream,
    charMs: 14,
    startDelayMs: 500,
    chunkSize: 2,
  });

  useEffect(() => {
    if (stream && done) {
      onStreamComplete?.();
    }
  }, [stream, done, onStreamComplete]);

  useEffect(() => {
    if (stream && !done) {
      onStreamTick?.();
    }
  }, [displayed, stream, done, onStreamTick]);

  const content = stream ? displayed : text;
  const showCursor = stream && !done;

  return (
    <>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      {showCursor && (
        <span className="cursor-blink ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] bg-[#C5F250]" />
      )}
    </>
  );
};
