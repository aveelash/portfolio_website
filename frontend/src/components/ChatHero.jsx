import React, { useState, useEffect, useRef } from "react";

export const ChatHero = ({
  collapsed,
  onStackToggle,
  onPromptClick,
  visitorInfo,
}) => {
  const [activeSkill, setActiveSkill] = useState(null);
  const [animatingSkill, setAnimatingSkill] = useState(null);
  const [isProofOpen, setIsProofOpen] = useState(false);

  const proofBoxRef = useRef(null);
  const topContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const company = visitorInfo?.company || "your company";

  const suggestedPrompts = [
    `Why is Aveelash a good fit for ${company}?`,
    "What DevOps projects has Aveelash built?",
    "How strong is Aveelash with AWS and Kubernetes?",
    "What production reliability work has Aveelash done?",
  ];

  const skills = [
    {
      name: "AWS",
      proof:
        "Deployed and operated real-world web applications on AWS using EKS, EC2, S3, IAM, VPC, and CloudWatch, where infrastructure automatically handled scaling, traffic spikes, and high availability without downtime. Built automated delivery pipelines using AWS CI/CD to deploy applications to Kubernetes with safe rollbacks, monitoring, and production-grade reliability.",
    },
    {
      name: "Kubernetes",
      proof:
        "Deployed and managed production workloads using Kubernetes on AWS EKS with automated scaling, service discovery, rolling updates, and self-healing to ensure zero-downtime application delivery in real-world environments.",
    },
    {
      name: "Terraform",
      proof:
        "Provisioned and managed AWS infrastructure using Infrastructure as Code with reusable modules, enabling consistent, version-controlled environments across development, staging, and production with automated deployments.",
    },
    {
      name: "Docker",
      proof:
        "Containerized applications into lightweight, portable images to ensure consistent runtime behavior across development, staging, and production environments with reliable deployment and scalability.",
    },
    {
      name: "CI/CD",
      proof:
        "Designed and implemented automated CI/CD pipelines using GitHub Actions to build, test, and deploy applications to production with consistent releases, faster delivery cycles, and reduced manual intervention.",
    },
    {
      name: "Observability",
      proof:
        "Built end-to-end observability systems using Prometheus, Grafana, and CloudWatch to monitor application metrics, logs, and alerts, ensuring real-time visibility, faster incident detection, and improved system reliability in production environments.",
    },
    {
      name: "Linux",
      proof:
        "Managed Linux-based cloud servers through system administration, shell scripting, process management, and networking to ensure stable, secure, and optimized production environments for running scalable applications.",
    },
    {
      name: "Python",
      proof:
        "Built automation scripts and DevOps tools to streamline deployment workflows, infrastructure provisioning, and operational tasks, reducing manual effort and improving system efficiency in production environments.",
    },
  ];

  const smoothScrollTo = (element, targetValue, duration = 650) => {
    const startValue = element.scrollTop;
    const changeInValue = targetValue - startValue;
    let startTime = null;

    const easeInOutCubic = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    };

    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;

      const timeElapsed = currentTime - startTime;

      const nextScrollPosition = easeInOutCubic(
        timeElapsed,
        startValue,
        changeInValue,
        duration,
      );

      element.scrollTop = nextScrollPosition;

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollTop = targetValue;
      }
    };

    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    const scrollContainer =
      topContainerRef.current?.closest(".custom-scrollbar");

    if (!scrollContainer) return;

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    if (activeSkill) {
      setAnimatingSkill(activeSkill);
      setIsProofOpen(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsProofOpen(true);
        });
      });

      const proceedToScroll = () => {
        if (proofBoxRef.current && proofBoxRef.current.offsetHeight > 0) {
          const targetScrollTop = proofBoxRef.current.offsetTop - 230;
          smoothScrollTo(scrollContainer, Math.max(0, targetScrollTop), 650);
        } else {
          scrollTimeoutRef.current = setTimeout(proceedToScroll, 30);
        }
      };

      scrollTimeoutRef.current = setTimeout(proceedToScroll, 250);
    } else {
      setIsProofOpen(false);
      smoothScrollTo(scrollContainer, 0, 650);

      scrollTimeoutRef.current = setTimeout(() => {
        setAnimatingSkill(null);
      }, 750);
    }

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [activeSkill]);

  const handleSkillClick = (skillName) => {
    if (activeSkill === skillName) {
      setActiveSkill(null);
      if (onStackToggle) onStackToggle(false);
    } else {
      setActiveSkill(skillName);
      if (onStackToggle) onStackToggle(true);
    }
  };

  const handlePromptClick = (prompt) => {
    if (!onPromptClick) return;
    onPromptClick(prompt);
  };

  return (
    <div
      ref={topContainerRef}
      data-testid="chat-hero"
      className={`relative flex flex-col items-center text-center transition-all duration-700 ${
        collapsed
          ? "opacity-0 pointer-events-none h-0 overflow-hidden"
          : "pt-2 sm:pt-4 md:pt-6 pb-2"
      }`}
    >
      {/* HERO */}
      <div className="w-full max-w-[980px] px-2 sm:px-4">
        <div className="text-[#C5F250] text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.18em] sm:tracking-[0.32em] uppercase">
          Cloud-Native Systems • Automation • Reliability
        </div>

        <h1 className="mt-2 sm:mt-4 text-[#f5f5f5] text-[34px] sm:text-[56px] md:text-[70px] lg:text-[80px] leading-[0.95] sm:leading-none tracking-[-0.065em] break-words">
          Aveelash Hota
        </h1>

        <div className="mt-3 sm:mt-5 max-w-[760px] mx-auto text-[#C5F250] text-[15px] sm:text-[18px] md:text-[21px] lg:text-[23px] leading-snug px-1">
          I build cloud systems that scale automatically, recover instantly, and
          run reliably in production.
        </div>

        <div className="mt-3 max-w-[680px] mx-auto text-[#8a8a8a] text-[11px] sm:text-xs md:text-sm leading-relaxed">
          DevOps engineer focused on automation, observability, and resilient
          cloud-native infrastructure design.
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="mt-4 sm:mt-5 md:mt-6 w-full max-w-[820px] px-2 sm:px-3">
      <div className="rounded-2xl sm:rounded-3xl border border-[#202632] bg-[#0d1118]/70 shadow-[0_20px_80px_rgba(0,0,0,0.22)] px-3 sm:px-4 py-3 sm:py-4">
          {/* ENGINEERING STACK */}
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#2a2a2a] bg-[#111111] px-4 py-2 shadow-[0_0_28px_rgba(197,242,80,0.08)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5F250] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5F250]" />
              </span>

              <span className="text-[#f5f5f5] text-[10px] tracking-[0.3em] uppercase font-medium">
                Engineering Stack
              </span>
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-2 max-w-[720px]">
              {skills.map((s) => (
                <button
                  key={s.name}
                  onClick={() => handleSkillClick(s.name)}
                  className={`
                    relative overflow-hidden group
                    px-3 py-1.5 rounded-full
                    text-[10px] sm:text-[11px] tracking-[0.11em] uppercase
                    transition-all duration-300
                    ${
                      activeSkill === s.name
                        ? "border border-[#C5F250] bg-[#111111] text-[#C5F250] shadow-[0_0_20px_rgba(197,242,80,0.18)]"
                        : "border border-[#242a35] bg-[#111722]/70 text-[#9b9b9b] hover:text-[#f5f5f5] hover:border-[#C5F250]/50"
                    }
                  `}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5F250]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                      activeSkill === s.name
                        ? "bg-[#C5F250]"
                        : "bg-[#4a4a4a] group-hover:bg-[#C5F250]"
                    }`}
                  />

                  <span className="relative">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DIVIDER */}
          {animatingSkill && (
            <div
              ref={proofBoxRef}
              className={`
      grid
      w-full
      max-w-[760px]
      mx-auto
      transition-[grid-template-rows,opacity,transform,filter,margin]
      duration-700
      ease-[cubic-bezier(0.16,1,0.3,1)]
      ${
        isProofOpen
          ? "grid-rows-[1fr] opacity-100 translate-y-0 blur-0 mt-4"
          : "grid-rows-[0fr] opacity-0 -translate-y-4 blur-sm mt-0"
      }
    `}
            >
              <div className="overflow-hidden">
                <div
                  className={`
          relative
          overflow-hidden
          rounded-2xl
          border
          border-[#2b3320]
          bg-gradient-to-b
          from-[#171914]
          via-[#12140f]
          to-[#0d0e0c]
          p-4
          shadow-[0_18px_60px_rgba(197,242,80,0.08)]
          transition-all
          duration-700
          ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isProofOpen ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"}
        `}
                >
                  {/* TOP GLOW LINE */}
                  <div
                    className={`
            absolute
            top-0
            left-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#C5F250]
            to-transparent
            transition-all
            duration-700
            ease-out
            ${isProofOpen ? "w-full opacity-100" : "w-0 opacity-0"}
          `}
                  />

                  {/* MOVING SHINE */}
                  <div
                    className={`
            absolute
            inset-0
            bg-gradient-to-r
            from-transparent
            via-[#C5F250]/10
            to-transparent
            transition-transform
            duration-1000
            ease-out
            ${isProofOpen ? "translate-x-full" : "-translate-x-full"}
          `}
                  />

                  {/* SOFT BACKGROUND GLOW */}
                  <div
                    className={`
            absolute
            -top-20
            left-1/2
            h-32
            w-64
            -translate-x-1/2
            rounded-full
            bg-[#C5F250]/10
            blur-3xl
            transition-opacity
            duration-700
            ${isProofOpen ? "opacity-100" : "opacity-0"}
          `}
                  />

                  <div className="relative">
                    <div
                      className={`
              flex
              items-center
              gap-3
              mb-3
              transition-all
              duration-500
              delay-150
              ${
                isProofOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }
            `}
                    >
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5F250] opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5F250]" />
                      </div>

                      <div className="text-[#C5F250] text-[10px] sm:text-xs tracking-[0.28em] uppercase">
                        Production Experience
                      </div>
                    </div>

                    <p
                      className={`
              text-[#d0d0d0]
              leading-relaxed
              text-xs
              sm:text-sm
              text-left
              transition-all
              duration-500
              delay-200
              ${
                isProofOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }
            `}
                    >
                      {skills.find((s) => s.name === animatingSkill)?.proof}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DIVIDER */}
          <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-[#263142] to-transparent" />

          {/* SUGGESTED QUESTIONS */}
          <div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="hidden sm:block h-px w-14 bg-gradient-to-r from-transparent via-[#2a2a2a] to-[#C5F250]/40" />

              <div className="group relative">
                <div className="absolute inset-0 rounded-full bg-[#C5F250]/10 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="relative inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#2a2a2a] bg-gradient-to-b from-[#181818] to-[#111111] shadow-[0_0_30px_rgba(197,242,80,0.08)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5F250] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5F250]" />
                  </span>

                  <span className="text-[#f5f5f5] text-[10px] tracking-[0.28em] uppercase font-medium">
                    Suggested Questions
                  </span>
                </div>
              </div>

              <div className="hidden sm:block h-px w-14 bg-gradient-to-l from-transparent via-[#2a2a2a] to-[#C5F250]/40" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-[700px] mx-auto">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  title={prompt}
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
                    text-[11px]
                    sm:text-xs
                    text-[#c7ccd6]
                    transition-all
                    duration-300
                    hover:border-[#C5F250]/40
                    hover:text-white
                    hover:bg-[#151c28]
                    text-center
                    leading-snug
                  "
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5F250]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative line-clamp-2 sm:line-clamp-2">
                    {prompt}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-3 flex justify-center px-2">
              <div className="group relative overflow-hidden rounded-2xl border border-[#2a2f3b] bg-[#0f151f]/80 px-4 py-3 text-center shadow-[0_0_30px_rgba(0,0,0,0.18)]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5F250]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative text-[10px] sm:text-[11px] leading-relaxed text-[#8f98a8]">
                  Want a deeper look? Type{" "}
                  <span className="rounded-md border border-[#C5F250]/25 bg-[#C5F250]/10 px-1.5 py-0.5 font-medium text-[#C5F250]">
                    /help
                  </span>{" "}
                  in the chat, or ask any question about Aveelash's projects,
                  skills, experience, or role fit.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
