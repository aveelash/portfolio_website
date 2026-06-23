import React, { useState, useCallback, useEffect, useRef } from "react";
import { Menu, Plus } from "lucide-react";
import "@/App.css";
import { ChatHero } from "./components/ChatHero";
import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";
import { IntroBrand } from "./components/IntroBrand";
import { SessionSidebar } from "./components/SessionSidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "./components/ui/sheet";
import { apiUrl } from "./utils/api";

let _id = 0;
const nextId = () => ++_id;

const MAX_QUESTIONS_PER_CHAT = 10;

/* ---------------- COMMAND MAP ---------------- */

const commandToKind = {
  "/help": "help",
  "/summary": "summary",
  "/recruiter": "recruiter",
  "/resume": "resume",
  "/projects": "projects",
  "/skills": "skills",
  "/experience": "experience",
  "/impact": "impact",
  "/about": "about",
  "/certifications": "certifications",
  "/education": "education",
  "/clear": "clear",
};

/* ---------------- APP ---------------- */

function App() {
  const introAlreadyPlayed =
    localStorage.getItem("candidateIntroPlayed") === "true";

  const savedVisitorName = localStorage.getItem("candidateVisitorName") || "";
  const savedVisitorCompany =
    localStorage.getItem("candidateVisitorCompany") || "";

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("sessions");
    if (!saved) return [];

    return JSON.parse(saved).map((session) => ({
      ...session,
      messages: session.messages.map((message) => {
        const { stream, isLoading, ...rest } = message;
        return rest;
      }),
    }));
  });

  const [showNameGate, setShowNameGate] = useState(() => {
    return !introAlreadyPlayed && (!savedVisitorName || !savedVisitorCompany);
  });

  const [showIntro, setShowIntro] = useState(() => {
    return !introAlreadyPlayed;
  });

  const [manualVisitorName, setManualVisitorName] = useState(savedVisitorName);
  const [manualVisitorCompany, setManualVisitorCompany] =
    useState(savedVisitorCompany);

  const [visitorNameInput, setVisitorNameInput] = useState("");
  const [visitorCompanyInput, setVisitorCompanyInput] = useState("");

  const [visitorLoaded, setVisitorLoaded] = useState(false);

  const [activeSessionId, setActiveSessionId] = useState(() => {
    const saved = sessionStorage.getItem("activeSessionId");
    return saved ? JSON.parse(saved) : null;
  });

  const [visitorInfo, setVisitorInfo] = useState({
    name: "there",
    company: "your company",
    sample_prompt: "Why should we interview Aveelash?",
  });

  const [userId, setUserId] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const endRef = useRef(null);

  const displayVisitorName = manualVisitorName || visitorInfo.name || "there";

  const displayVisitorCompany =
    manualVisitorCompany || visitorInfo.company || "your company";

  const displaySamplePrompt = `Why is Aveelash a good fit for ${displayVisitorCompany}?`;

  /* FETCH VISITOR INFO FROM BACKEND */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userIdFromUrl = params.get("user");

    setUserId(userIdFromUrl);

    const fetchVisitorInfo = async () => {
      if (!userIdFromUrl) {
        setVisitorLoaded(true);
        return;
      }

      try {
        const response = await fetch(
          apiUrl(`/info?user=${encodeURIComponent(userIdFromUrl)}`),
        );

        if (!response.ok) {
          throw new Error("Failed to fetch visitor info");
        }

        const data = await response.json();
        setVisitorInfo(data);
      } catch (error) {
        console.error("Could not load visitor info:", error);
      } finally {
        setVisitorLoaded(true);
      }
    };

    fetchVisitorInfo();
  }, []);

  /* NAME + COMPANY SUBMIT */
  const handleNameSubmit = (e) => {
    e.preventDefault();

    const cleanName = visitorNameInput.trim();
    const cleanCompany = visitorCompanyInput.trim();

    if (!cleanName || !cleanCompany) return;

    setManualVisitorName(cleanName);
    setManualVisitorCompany(cleanCompany);

    localStorage.setItem("candidateVisitorName", cleanName);
    localStorage.setItem("candidateVisitorCompany", cleanCompany);

    setShowNameGate(false);
  };

  /* MARK INTRO AS PLAYED ONLY AFTER NAME SCREEN IS DONE */
  useEffect(() => {
    if (showIntro && !showNameGate) {
      localStorage.setItem("candidateIntroPlayed", "true");
    }
  }, [showIntro, showNameGate]);

  /* INTRO TIMER */
  useEffect(() => {
    if (!showIntro) return;
    if (showNameGate) return;
    if (!visitorLoaded) return;

    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [showIntro, showNameGate, visitorLoaded]);

  /* AUTO SCROLL */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSessionId]);

  const handleStreamTick = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleStreamComplete = useCallback((messageId) => {
    setIsThinking(false);

    setSessions((prev) =>
      prev.map((session) => ({
        ...session,
        messages: session.messages.map((message) =>
          message.id === messageId
            ? { ...message, stream: false, streamComplete: true }
            : message,
        ),
      })),
    );
  }, []);

  /* SAVE TO LOCALSTORAGE */
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  /* SYNC ACTIVE SESSION TO SESSIONSTORAGE */
  useEffect(() => {
    if (activeSessionId !== null) {
      sessionStorage.setItem(
        "activeSessionId",
        JSON.stringify(activeSessionId),
      );
    } else {
      sessionStorage.removeItem("activeSessionId");
    }
  }, [activeSessionId]);

  /* CREATE SESSION */
  const createSession = useCallback((firstCmd = "New Chat") => {
    const id = Date.now();

    const newSession = {
      id,
      title: firstCmd,
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);

    return id;
  }, []);

  /* DELETE SESSION FROM SIDEBAR */
  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));

    if (String(activeSessionId) === String(id)) {
      setActiveSessionId(null);
    }
  };

  const activeSession = sessions.find(
    (s) => String(s.id) === String(activeSessionId),
  );

  const messages = activeSession?.messages || [];

  const isEmptyNewChat =
    activeSession &&
    activeSession.title === "New Chat" &&
    messages.length === 0;

  const showHomeScreen = activeSessionId === null || isEmptyNewChat;

  const getRelatedPrompts = useCallback((prompt) => {
    const p = prompt.toLowerCase();

    if (
      p.includes("why") ||
      p.includes("fit") ||
      p.includes("take") ||
      p.includes("hire") ||
      p.includes("consider") ||
      p.includes("interview")
    ) {
      return [
        "What are Aveelash's strongest DevOps skills?",
        "Which projects best show Aveelash's infrastructure experience?",
        "What kind of role is Aveelash best suited for?",
      ];
    }

    if (p.includes("project")) {
      return [
        "Which project is most relevant for DevOps roles?",
        "How did Aveelash use AWS or Kubernetes in his projects?",
        "What impact did Aveelash create through his projects?",
      ];
    }

    if (p.includes("skill") || p.includes("aws") || p.includes("kubernetes")) {
      return [
        "How strong is Aveelash with AWS and Kubernetes?",
        "What DevOps tools has Aveelash worked with?",
        "How does Aveelash approach production reliability?",
      ];
    }

    if (p.includes("resume") || p.includes(" cv") || p === "cv") {
      return [
        "Can you share Aveelash's AWS certificate?",
        "What are Aveelash's strongest DevOps skills?",
        "Which projects best represent Aveelash's work?",
      ];
    }

    if (p.includes("certificate") || p.includes("certification")) {
      return [
        "Can you send Aveelash's resume?",
        "What AWS skills does Aveelash have?",
        "Why should we consider Aveelash for a DevOps role?",
      ];
    }

    if (p.includes("experience") || p.includes("work")) {
      return [
        "What production systems has Aveelash worked on?",
        "How does Aveelash handle ownership in engineering work?",
        "Why is Aveelash relevant for SRE or Platform Engineering?",
      ];
    }

    return [
      "Why should we consider Aveelash for a DevOps role?",
      "What are Aveelash's strongest technical skills?",
      "Which projects best represent Aveelash's work?",
    ];
  }, []);

  /* ASK BACKEND GEMINI API */
  const askBackend = useCallback(
    async ({ sessionId, prompt }) => {
      const loadingMessageId = nextId();

      setIsThinking(true);

      setSessions((prev) =>
        prev.map((s) =>
          String(s.id) === String(sessionId)
            ? {
                ...s,
                messages: [
                  ...s.messages,
                  {
                    id: loadingMessageId,
                    role: "agent",
                    isLoading: true,
                  },
                ],
              }
            : s,
        ),
      );

      try {
        const response = await fetch(apiUrl("/chat"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            visitor_name:
              displayVisitorName ||
              localStorage.getItem("candidateVisitorName") ||
              null,
            visitor_company:
              displayVisitorCompany ||
              localStorage.getItem("candidateVisitorCompany") ||
              null,
            prompt,
          }),
        });

        if (!response.ok) {
          let errorMessage = "Could not get an answer right now. Please try again.";

          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
          } catch (_) {
            // keep fallback message
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();

        setSessions((prev) =>
          prev.map((s) =>
            String(s.id) === String(sessionId)
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === loadingMessageId
                      ? {
                          id: loadingMessageId,
                          role: "agent",
                          markdown: data.answer,
                          stream: true,
                          attachments: data.attachments || [],
                          relatedPrompts: getRelatedPrompts(prompt),
                        }
                      : m,
                  ),
                }
              : s,
          ),
        );
      } catch (error) {
        console.error("Backend chat failed:", error);
        setIsThinking(false);

        setSessions((prev) =>
          prev.map((s) =>
            String(s.id) === String(sessionId)
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === loadingMessageId
                      ? {
                          id: loadingMessageId,
                          type: "error",
                          text:
                            error.message ||
                            "Could not get an answer right now. Please try again.",
                        }
                      : m,
                  ),
                }
              : s,
          ),
        );
      }
    },
    [userId, getRelatedPrompts, displayVisitorName, displayVisitorCompany],
  );

  /* COMMAND HANDLER */
  const runCommand = useCallback(
    async (raw) => {
      const input = raw.trim();
      if (!input) return;

      if (isThinking) return;

      if (input === "/clear") {
        if (!activeSessionId) return;

        setSessions((prev) =>
          prev.map((s) =>
            String(s.id) === String(activeSessionId)
              ? {
                  ...s,
                  title: "New Chat",
                  messages: [],
                }
              : s,
          ),
        );

        return;
      }

      let sessionId = activeSessionId;

      if (!sessionId) {
        const reusableNewChat = sessions.find(
          (s) => s.title === "New Chat" && s.messages.length === 0,
        );

        if (reusableNewChat) {
          sessionId = reusableNewChat.id;
          setActiveSessionId(sessionId);
        } else {
          sessionId = createSession(input);
        }
      }

      const selectedSession = sessions.find(
        (s) => String(s.id) === String(sessionId),
      );

      const currentQuestionCount =
        selectedSession?.messages?.filter((m) => m.type === "user").length || 0;

      const isCommand = input.startsWith("/");

      if (!isCommand && currentQuestionCount >= MAX_QUESTIONS_PER_CHAT) {
        const limitNotice =
          "This chat has reached 10 questions. Please start a New Chat to ask more questions. Your daily usage limit still applies across all chats.";

        setSessions((prev) =>
          prev.map((s) =>
            String(s.id) === String(sessionId)
              ? {
                  ...s,
                  messages: s.messages.some((m) => m.text === limitNotice)
                    ? s.messages
                    : [
                        ...s.messages,
                        {
                          id: nextId(),
                          role: "system",
                          text: limitNotice,
                        },
                      ],
                }
              : s,
          ),
        );

        return;
      }

      const userMessage = {
        id: nextId(),
        type: "user",
        text: input,
      };

      setSessions((prev) =>
        prev.map((s) =>
          String(s.id) === String(sessionId)
            ? {
                ...s,
                title: s.title === "New Chat" ? input : s.title,
                messages: [...s.messages, userMessage],
              }
            : s,
        ),
      );

      if (input.startsWith("/")) {
        const kind = commandToKind[input];

        const botMessage = kind
          ? { id: nextId(), kind }
          : {
              id: nextId(),
              type: "error",
              text: `"${input}" is an invalid command. Please check /help to see what commands you can type.`,
            };

        setSessions((prev) =>
          prev.map((s) =>
            String(s.id) === String(sessionId)
              ? {
                  ...s,
                  messages: [...s.messages, botMessage],
                }
              : s,
          ),
        );

        return;
      }

      await askBackend({
        sessionId,
        prompt: input,
      });
    },
    [activeSessionId, isThinking, askBackend, sessions, createSession],
  );

  /* Helper utility to force search bar focus if someone clicks empty spaces */
  const handleWorkspaceClick = (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
      const inputEl = document.querySelector('[data-testid="chat-input"]');
      inputEl?.focus();
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMobileSidebarOpen(false);
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    setMobileSidebarOpen(false);
  };

  /* ---------------- NAME GATE UI ---------------- */
  if (showNameGate) {
    return (
      <div className="min-h-screen h-[100dvh] w-full bg-[#07090d] text-white flex items-center justify-center overflow-hidden px-4 safe-top safe-bottom safe-x">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,242,80,0.10),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_45%,rgba(0,0,0,0.25))]" />

        <form
          onSubmit={handleNameSubmit}
          className="relative w-full max-w-xl px-0 sm:px-6 text-center animate-[introSlideUp_1.2s_ease-out_forwards]"
        >
          <IntroBrand size="compact" />

          <div className="text-[#f5f5f5] text-3xl sm:text-4xl md:text-5xl tracking-[-0.06em] font-semibold intro-namegate-welcome">
            Welcome.
          </div>

          <div className="mt-4 text-[#9ca3af] text-sm md:text-base">
            Tell me a little about you.
          </div>

          <div className="mt-7 sm:mt-8 space-y-3">
            <div className="rounded-2xl border border-[#252c3a] bg-[#0b0e13]/80 p-2 shadow-[0_0_50px_rgba(0,0,0,0.25)]">
              <input
                value={visitorNameInput}
                onChange={(e) => setVisitorNameInput(e.target.value)}
                autoFocus
                placeholder="Your name"
                className="w-full bg-transparent px-4 sm:px-5 py-3.5 sm:py-4 text-base sm:text-lg text-white placeholder:text-[#596273] outline-none"
              />
            </div>

            <div className="rounded-2xl border border-[#252c3a] bg-[#0b0e13]/80 p-2 shadow-[0_0_50px_rgba(0,0,0,0.25)]">
              <input
                value={visitorCompanyInput}
                onChange={(e) => setVisitorCompanyInput(e.target.value)}
                placeholder="Company name"
                className="w-full bg-transparent px-4 sm:px-5 py-3.5 sm:py-4 text-base sm:text-lg text-white placeholder:text-[#596273] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!visitorNameInput.trim() || !visitorCompanyInput.trim()}
            className="
              mt-6
              rounded-xl
              bg-[#C5F250]
              px-6
              py-3
              text-sm
              font-semibold
              text-black
              transition-all
              hover:bg-[#d7ff65]
              hover:shadow-[0_0_24px_rgba(197,242,80,0.25)]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:hover:shadow-none
            "
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  /* ---------------- INTRO UI ---------------- */
  if (showIntro) {
    return (
      <div className="min-h-screen h-[100dvh] w-full bg-[#07090d] text-white flex items-center justify-center overflow-hidden px-4 safe-top safe-bottom safe-x">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,242,80,0.10),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_45%,rgba(0,0,0,0.25))]" />

        <div className="relative w-full max-w-5xl px-0 sm:px-6 text-center animate-[introFade_10s_ease-in-out_forwards]">
          <IntroBrand size="hero" />

          <div className="mt-8 sm:mt-10 intro-welcome-name">
            <div className="text-[#7f8796] text-xs md:text-sm uppercase tracking-[0.35em] sm:tracking-[0.45em] mb-3 sm:mb-4">
              Welcome
            </div>

            <div className="text-[#f5f5f5] text-[36px] sm:text-[52px] md:text-[72px] leading-none tracking-[-0.06em] font-semibold break-words">
              {displayVisitorName}
            </div>
          </div>

          <div className="mt-6 sm:mt-7 text-[#C5F250] text-lg sm:text-xl md:text-2xl tracking-[-0.03em] font-medium intro-welcome-company">
            A tailored experience for {displayVisitorCompany}.
          </div>

          <div className="mt-4 sm:mt-5 max-w-[760px] mx-auto text-[#a3abb8] text-sm md:text-base leading-6 md:leading-7 intro-welcome-desc">
            Explore how Aveelash approaches cloud infrastructure, automation,
            DevOps, and production reliability with ownership and clarity.
          </div>

          <div className="mt-9 sm:mt-12 mx-auto h-px w-[160px] sm:w-[220px] bg-gradient-to-r from-transparent via-[#C5F250]/50 to-transparent intro-welcome-divider" />

          <div className="mt-7 sm:mt-8 intro-welcome-loader">
            <div className="flex items-center justify-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#C5F250] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C5F250]" />
              </span>

              <span className="text-[#7f8796] text-[10px] sm:text-xs tracking-[0.22em] sm:tracking-[0.28em] uppercase">
                Preparing your view
              </span>
            </div>

            <div className="mt-5 mx-auto h-[3px] w-[220px] sm:w-[260px] overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#C5F250] animate-[introLoader_10s_ease-in-out_forwards]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen h-[100dvh] w-full flex bg-[#0b0e13] text-white overflow-hidden safe-top">
      {/* ---------------- DESKTOP SIDEBAR ---------------- */}
      <div className="hidden md:flex md:w-[240px] lg:w-[280px] bg-[#07090d] border-r border-[#242833] flex-col flex-shrink-0 h-full overflow-hidden">
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={deleteSession}
        />
      </div>

      {/* ---------------- MOBILE SIDEBAR DRAWER ---------------- */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[min(88vw,320px)] p-0 border-[#242833] bg-[#07090d] text-white [&>button]:text-[#b8beca] [&>button]:hover:text-white"
        >
          <SheetTitle className="sr-only">Chat history</SheetTitle>
          <SessionSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onNewChat={handleNewChat}
            onSelectSession={handleSelectSession}
            onDeleteSession={deleteSession}
          />
        </SheetContent>
      </Sheet>

      {/* ---------------- MAIN WORKSPACE ---------------- */}
      <div
        onClick={handleWorkspaceClick}
        className="flex-1 flex flex-col relative h-full max-h-[100dvh] overflow-hidden cursor-text min-w-0"
      >
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-2 px-3 py-2.5 border-b border-[#2a2a2a] bg-[#0b0e13] z-10 flex-shrink-0 safe-x">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="w-9 h-9 rounded-lg border border-[#2a3040] bg-[#111722] text-[#b8beca] flex items-center justify-center shrink-0"
            aria-label="Open chat history"
          >
            <Menu className="w-4 h-4" strokeWidth={2} />
          </button>

          <div className="flex-1 min-w-0 text-center text-xs text-gray-400 truncate px-1">
            <span className="text-[#ECECEC]">AveelashGPT</span>
            <span className="mx-1.5 text-[#3A4049]">·</span>
            <span>for {displayVisitorCompany}</span>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            className="w-9 h-9 rounded-lg bg-[#C5F250] text-black flex items-center justify-center shrink-0"
            aria-label="New chat"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block px-4 lg:px-6 py-3 border-b border-[#2a2a2a] text-xs lg:text-sm text-gray-400 bg-[#0b0e13] z-10 flex-shrink-0 select-none truncate safe-x">
          AveelashGPT · for {displayVisitorCompany}
        </div>

        {showHomeScreen ? (
          <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden box-border">
            <div
              className={`w-full flex-1 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-3 flex flex-col items-center custom-scrollbar min-h-0 ${
                isStackExpanded ? "overflow-y-auto" : "overflow-y-auto md:overflow-hidden"
              }`}
            >
              <div className="w-full max-w-4xl my-auto py-2 sm:py-0">
                <ChatHero
                  onStackToggle={setIsStackExpanded}
                  onPromptClick={runCommand}
                  visitorInfo={{
                    ...visitorInfo,
                    name: displayVisitorName,
                    company: displayVisitorCompany,
                  }}
                />
              </div>
            </div>

            <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 md:px-10 pb-3 md:pb-3 pt-0 flex-shrink-0 safe-bottom safe-x">
              <ChatInput
                onSubmit={runCommand}
                history={[]}
                placeholder={displaySamplePrompt}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-4 pt-3 sm:pt-4 pb-4 custom-scrollbar min-h-0 safe-x">
              <div className="w-full max-w-2xl mx-auto space-y-5 sm:space-y-6 pb-4">
                {messages.map((b) => (
                  <ChatMessage
                    key={b.id}
                    block={b}
                    onPromptClick={runCommand}
                    onStreamComplete={
                      b.stream && !b.streamComplete
                        ? () => handleStreamComplete(b.id)
                        : undefined
                    }
                    onStreamTick={
                      b.stream && !b.streamComplete
                        ? handleStreamTick
                        : undefined
                    }
                  />
                ))}
                <div ref={endRef} />
              </div>
            </div>

            <div className="flex-shrink-0 bg-[#0b0e13] pt-2 pb-3 sm:pb-4 md:pb-6 z-10 border-t border-[#1f242e]/60 safe-bottom safe-x">
              <div className="w-full max-w-2xl mx-auto px-1 sm:px-2 md:px-4">
                <div className="mb-2 hidden sm:flex justify-center">
                  <div className="rounded-full border border-[#2a2f3b] bg-[#111722]/80 px-2.5 py-1.5 text-[11px] text-[#8f98a8]">
                    Tip: type{" "}
                    <span className="text-[#C5F250] font-medium">/clear</span>{" "}
                    to clear the whole chat.
                  </div>
                </div>

                <ChatInput
                  onSubmit={runCommand}
                  placeholder={
                    isThinking
                      ? "Aveelash's agent is thinking..."
                      : displaySamplePrompt
                  }
                  history={messages
                    .filter((m) => m.type === "user")
                    .map((m) => m.text)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;