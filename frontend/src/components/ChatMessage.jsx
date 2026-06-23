import React from "react";
import { OutputBlock } from "./OutputBlock";
import { FileAttachments } from "./FileAttachments";
import { StreamingMarkdown, ThinkingIndicator } from "./StreamingMarkdown";

/* ---------------- AVATAR ---------------- */

const Avatar = ({ role }) => {
  if (role === "user") {
    return (
      <div className="w-7 h-7 rounded-full bg-[#3a3a3a] text-[#ECECEC] flex items-center justify-center text-[11px] font-semibold shrink-0">
        You
      </div>
    );
  }

  return (
    <div className="w-7 h-7 rounded-full bg-[#C5F250] text-[#171717] flex items-center justify-center text-[11px] font-semibold shrink-0">
      AH
    </div>
  );
};

/* ---------------- HEADER ---------------- */

const Header = ({ role }) => (
  <div className="flex items-center gap-2 mb-1">
    <Avatar role={role} />
    <span className="text-[12px] text-[#9b9b9b]">
      {role === "user" ? "You" : "AveelashGPT"}
    </span>
  </div>
);

/* ---------------- RELATED PROMPTS ---------------- */

const RelatedPrompts = ({ prompts = [], onPromptClick }) => {
  if (!prompts.length || !onPromptClick) return null;

  return (
    <div className="mt-4">
      <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[#6f7785]">
        You can also ask
      </div>

      <div className="flex flex-col gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPromptClick(prompt)}
            className="
              group
              relative
              overflow-hidden
              rounded-xl
              border
              border-[#2a2f3b]
              bg-[#101722]/80
              px-3
              py-2.5
              text-left
              text-[12px]
              text-[#c7ccd6]
              transition-all
              duration-300
              hover:border-[#C5F250]/40
              hover:bg-[#151c28]
              hover:text-white
            "
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5F250]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <span className="relative flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5F250]/70 shrink-0" />
              <span>{prompt}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ---------------- CHAT MESSAGE ---------------- */

export const ChatMessage = ({
  block,
  onPromptClick,
  onStreamComplete,
  onStreamTick,
}) => {
  const role = block.role || block.type || "agent";

  /* ---------------- SYSTEM / TIP MESSAGE ---------------- */
  if (role === "system") {
    return (
      <div className="flex justify-center w-full">
        <div className="rounded-full border border-[#2a2f3b] bg-[#111722]/70 px-4 py-2 text-[11px] sm:text-xs text-[#8f98a8]">
          {block.text}
        </div>
      </div>
    );
  }

  /* ---------------- USER MESSAGE ---------------- */
  if (role === "user") {
    return (
      <div className="flex flex-col w-full">
        <Header role="user" />

        <div className="ml-9 max-w-[calc(100%-2.25rem)] sm:max-w-[85%] md:max-w-fit inline-flex rounded-2xl bg-[#2a2a2a] border border-[#333333] px-3 py-1.5 text-[13px] sm:text-[14px] text-[#ECECEC] break-words">
          {block.text}
        </div>
      </div>
    );
  }

  /* ---------------- ERROR MESSAGE ---------------- */
  if (role === "error") {
    return (
      <div className="flex flex-col w-full">
        <Header role="agent" />

        <div className="ml-9 text-red-400 text-sm">{block.text}</div>
      </div>
    );
  }

  /* ---------------- AGENT RESPONSE ---------------- */
const isThinking = block.isLoading || block.markdown === "Thinking...";
const showExtras = !isThinking && (!block.stream || block.streamComplete);

return (
  <div className="flex gap-2 items-start sm:gap-3 w-full px-1 sm:px-0">
    <Avatar role="agent" />

    <div className="min-w-0 flex-1 max-w-full sm:max-w-[720px] prose-chat">
      {block.isLoading ? (
        <ThinkingIndicator />
      ) : block.markdown ? (
        <StreamingMarkdown
          text={block.markdown}
          stream={Boolean(block.stream)}
          onStreamComplete={onStreamComplete}
          onStreamTick={onStreamTick}
        />
      ) : block.kind ? (
        <OutputBlock block={block} />
      ) : null}

      {showExtras && <FileAttachments attachments={block.attachments} />}

      {showExtras && (
        <RelatedPrompts
          prompts={block.relatedPrompts}
          onPromptClick={onPromptClick}
        />
      )}
    </div>
  </div>
);
}
