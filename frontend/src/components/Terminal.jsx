import React, { useEffect, useRef } from "react";
import { OutputBlock } from "./OutputBlock";

export const Terminal = ({ blocks }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [blocks]);

  return (
    <div
      data-testid="terminal"
      className="flex-1 overflow-y-auto terminal-scroll bg-[#040608]"
    >
      <div className="max-w-[960px] mx-auto px-6 py-4 space-y-3 leading-[1.5]">
        {blocks.map((b, i) => (
          <OutputBlock key={b.id ?? i} block={b} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};
