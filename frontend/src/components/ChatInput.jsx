import React, { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { allCommands } from "../data/content";

const countWords = (text) => {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
};

export const ChatInput = ({
  onSubmit,
  history = [],
  autoFocus = true,
  placeholder = "Type /help to know what commands you can type...",
}) => {
  const [value, setValue] = useState("");
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef(null);

  const wordCount = countWords(value);
  const isOverLimit = wordCount > 100;
  const canSubmit = value.trim() && !isOverLimit;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [autoFocus]);

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    if (countWords(v) > 100) return;

    onSubmit(v);
    setValue("");
    setHIndex(-1);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;

      const newIndex =
        hIndex === -1 ? history.length - 1 : Math.max(0, hIndex - 1);

      setHIndex(newIndex);
      setValue(history[newIndex] || "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      if (history.length === 0 || hIndex === -1) return;

      const newIndex = hIndex + 1;

      if (newIndex >= history.length) {
        setHIndex(-1);
        setValue("");
      } else {
        setHIndex(newIndex);
        setValue(history[newIndex] || "");
      }

      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();

      if (value.startsWith("/")) {
        const match = allCommands.find((c) => c.startsWith(value));
        if (match) setValue(match);
      }
    }
  };

  const showSuggestions =
    value.trim().startsWith("/") && value.trim().length > 0;

  const suggestions = showSuggestions
    ? value.trim() === "/"
      ? allCommands.slice(0, 8)
      : allCommands.filter((c) => c.startsWith(value.trim())).slice(0, 8)
    : [];

  return (
    <div className="w-full">
      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setValue(s);
                inputRef.current?.focus();
              }}
              className="
                text-[11px]
                sm:text-[12px]
                px-2
                py-0.5
                rounded-full
                border
                border-[#3a3a3a]
                bg-[#2a2a2a]
                text-[#ECECEC]
                transition-colors
                hover:bg-[#343434]
              "
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div
        data-testid="chat-input-box"
        className={`
          group
          flex
          items-center
          gap-2
          px-3
          md:px-4
          py-2
          rounded-[20px]
          md:rounded-[22px]
          bg-[#2a2a2a]
          border
          shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_30px_rgba(0,0,0,0.35)]
          transition-all
          duration-200
          w-full
          ${
            isOverLimit
              ? "border-red-400/60 focus-within:border-red-400/80"
              : "border-[#3a3a3a] focus-within:border-[#C5F250]/50 focus-within:shadow-[0_0_24px_rgba(197,242,80,0.10)]"
          }
        `}
      >
        <input
          ref={inputRef}
          data-testid="chat-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          className="
            flex-1
            min-w-0
            bg-transparent
            outline-none
            text-[14px]
            md:text-[15px]
            text-[#ECECEC]
            placeholder:text-[#8a8a8a]
            truncate
          "
        />

        <button
          data-testid="input-send"
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-150 flex-shrink-0 ${
            canSubmit
              ? "bg-[#C5F250] text-[#171717] hover:shadow-[0_0_14px_rgba(197,242,80,0.45)] cursor-pointer active:scale-95"
              : "bg-[#3a3a3a] text-[#7a7a7a] cursor-not-allowed"
          }`}
        >
          <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Word Limit */}
      {value.trim() && (
        <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] sm:text-[11px]">
          <div className={isOverLimit ? "text-red-400" : "text-[#697284]"}>
            {wordCount}/100 words
          </div>

          {isOverLimit ? (
            <div className="text-red-400 text-right">Keep under 100 words.</div>
          ) : (
            <div className="hidden sm:block text-[#4f5665]">Recruiter questions only</div>
          )}
        </div>
      )}
    </div>
  );
};
