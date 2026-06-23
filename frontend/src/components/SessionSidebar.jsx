import React from "react";

export const SessionSidebar = ({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  className = "",
}) => {
  return (
    <div className={`flex flex-col h-full overflow-hidden ${className}`}>
      <div className="p-3 sm:p-4 border-b border-[#1f2430]">
        <button
          type="button"
          onClick={onNewChat}
          className="
            w-full
            group
            relative
            overflow-hidden
            bg-[#C5F250]
            text-black
            font-semibold
            rounded-xl
            px-4
            py-3
            text-sm
            transition-all
            duration-200
            hover:bg-[#d7ff65]
            hover:shadow-[0_0_24px_rgba(197,242,80,0.25)]
            active:scale-[0.98]
          "
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-lg leading-none">+</span>
            New Chat
          </span>
          <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>
      </div>

      <div className="px-3 sm:px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-[0.25em] text-[#7f8796]">
            Recents
          </div>
          <div className="text-[11px] text-[#4f5665]">{sessions.length}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 sm:px-3 pb-4 space-y-1 custom-scrollbar min-h-0">
        {sessions.length === 0 ? (
          <div className="mt-6 px-3 py-4 rounded-xl border border-dashed border-[#2a3040] bg-[#0d1118] text-center">
            <div className="text-[#7f8796] text-sm">No chats yet</div>
            <div className="text-[#4f5665] text-xs mt-1">
              Start with a prompt below
            </div>
          </div>
        ) : (
          sessions.map((s) => {
            const isActive = String(s.id) === String(activeSessionId);

            return (
              <div
                key={s.id}
                className={`
                  group
                  relative
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                  transition-all
                  duration-200
                  border
                  ${
                    isActive
                      ? "bg-[#C5F250]/10 border-[#C5F250]/35 shadow-[0_0_22px_rgba(197,242,80,0.08)]"
                      : "bg-transparent border-transparent hover:bg-[#111722] hover:border-[#252c3a]"
                  }
                `}
              >
                <button
                  type="button"
                  onClick={() => onSelectSession(s.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  title={s.title}
                >
                  <span
                    className={`
                      h-1.5
                      w-1.5
                      rounded-full
                      flex-shrink-0
                      ${
                        isActive
                          ? "bg-[#C5F250] shadow-[0_0_10px_rgba(197,242,80,0.75)]"
                          : "bg-[#3a4252] group-hover:bg-[#C5F250]/70"
                      }
                    `}
                  />
                  <span
                    className={`
                      truncate
                      ${
                        isActive
                          ? "text-[#f5f5f5]"
                          : "text-[#b8beca] group-hover:text-[#f5f5f5]"
                      }
                    `}
                  >
                    {s.title || "New Chat"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteSession(s.id)}
                  className={`
                    w-7
                    h-7
                    rounded-md
                    flex
                    items-center
                    justify-center
                    transition-all
                    flex-shrink-0
                    ${
                      isActive
                        ? "opacity-100 text-[#8f98a8] hover:text-red-300 hover:bg-red-500/10"
                        : "opacity-100 md:opacity-0 md:group-hover:opacity-100 text-[#697284] hover:text-red-300 hover:bg-red-500/10"
                    }
                  `}
                  title="Delete chat"
                  aria-label={`Delete ${s.title || "chat"}`}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 sm:p-4 border-t border-[#1f2430] bg-[#080b10] safe-bottom">
        <div className="rounded-xl bg-[#0d1118] border border-[#202634] px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C5F250] animate-pulse" />
            <div className="text-xs text-[#d6d9df]">Portfolio Agent</div>
          </div>
          <div className="text-[11px] text-[#697284] mt-1 leading-relaxed">
            Ask about projects, skills, experience, or company fit.
          </div>
        </div>
      </div>
    </div>
  );
};
