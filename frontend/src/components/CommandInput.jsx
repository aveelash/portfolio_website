import React, { useState, useRef, useEffect } from "react";
import { CornerDownLeft } from "lucide-react";
import { allCommands } from "../data/content";

export const CommandInput = ({ onSubmit, history }) => {
  const [value, setValue] = useState("");
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    onSubmit(v);
    setValue("");
    setHIndex(-1);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = Math.min(hIndex + 1, history.length - 1);
      setHIndex(next);
      setValue(history[history.length - 1 - next] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex <= 0) {
        setHIndex(-1);
        setValue("");
      } else {
        const next = hIndex - 1;
        setHIndex(next);
        setValue(history[history.length - 1 - next] || "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (value.startsWith("/")) {
        const match = allCommands.find((c) => c.startsWith(value));
        if (match) setValue(match);
      }
    }
  };

  const showSuggestion =
    value.startsWith("/") &&
    value.length > 1 &&
    allCommands.some((c) => c.startsWith(value) && c !== value);

  const suggestions = showSuggestion
    ? allCommands.filter((c) => c.startsWith(value)).slice(0, 5)
    : [];

  return (
    <div
      data-testid="command-input-wrapper"
      className="border-t border-[#1f242e] bg-[#090b0f]"
    >
      {suggestions.length > 0 && (
        <div
          className="px-6 pt-2 flex flex-wrap gap-1.5"
          data-testid="suggestions"
        >
          {suggestions.map((s) => (
            <button
              key={s}
              onMouseDown={(e) => {
                e.preventDefault();
                setValue(s);
                inputRef.current?.focus();
              }}
              className="text-[11.5px] px-1.5 py-0.5 border border-[#1f242e] text-[#00f5d4] hover:border-[#00f5d4]/50 hover:bg-[#0e1218] cursor-pointer transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 px-6 py-3">
        <span className="text-[#00f5d4] text-[14px] select-none">›</span>
        <input
          ref={inputRef}
          data-testid="command-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a slash command"
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent outline-none text-[14px] text-[#E7EAF0] placeholder:text-[#5a6270] font-mono caret-[#00f5d4]"
        />
        <span className="cursor-blink w-[7px] h-[15px] bg-[#00f5d4] -ml-1" />
        <button
          data-testid="submit-command"
          onClick={submit}
          className="text-[11px] text-[#8A9099] hover:text-[#E7EAF0] inline-flex items-center gap-1 border border-[#1f242e] hover:border-[#00f5d4]/50 px-1.5 py-0.5 cursor-pointer transition-colors"
        >
          enter <CornerDownLeft className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
