import React from "react";

const BRAND_PREFIX = "Aveelash";
const BRAND_SUFFIX = "GPT";

export const IntroBrand = ({ size = "hero" }) => {
  const isHero = size === "hero";

  const textSize = isHero
    ? "text-[46px] sm:text-[64px] md:text-[88px] lg:text-[102px]"
    : "text-[26px] sm:text-[34px] md:text-[40px]";

  const letterDelay = isHero ? 0.07 : 0.05;
  const prefixOffset = 0;
  const suffixOffset = BRAND_PREFIX.length * letterDelay + 0.12;

  return (
    <div
      data-testid="intro-brand"
      className={`intro-brand relative inline-flex flex-col items-center ${isHero ? "mb-2 sm:mb-3" : "mb-5 sm:mb-6"}`}
    >
      {isHero && (
        <div
          className="intro-brand-orb absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[140px] w-[280px] sm:h-[180px] sm:w-[360px] md:h-[220px] md:w-[440px] rounded-full bg-[#C5F250]/12 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div className="relative flex items-center justify-center gap-2 sm:gap-3">
        {isHero && (
          <span
            className="intro-brand-chip opacity-0 rounded-full border border-[#C5F250]/25 bg-[#C5F250]/8 px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#C5F250]/90"
            aria-hidden="true"
          >
            AI
          </span>
        )}

        <h1
          className={`intro-brand-word relative ${textSize} leading-none tracking-[-0.06em] font-semibold select-none`}
          aria-label="AveelashGPT"
        >
          <span className="inline-flex items-baseline overflow-hidden">
            {BRAND_PREFIX.split("").map((char, index) => (
              <span
                key={`p-${index}`}
                className="intro-brand-letter text-[#f5f5f5]"
                style={{
                  animationDelay: `${prefixOffset + index * letterDelay}s`,
                }}
              >
                {char}
              </span>
            ))}

            <span className="inline-flex items-baseline ml-[0.04em]">
              {BRAND_SUFFIX.split("").map((char, index) => (
                <span
                  key={`s-${index}`}
                  className="intro-brand-letter intro-brand-letter-accent text-[#C5F250]"
                  style={{
                    animationDelay: `${suffixOffset + index * letterDelay}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>

          <span
            className="intro-brand-shimmer absolute inset-0 pointer-events-none"
            aria-hidden="true"
          />

          <span
            className="intro-brand-underline absolute -bottom-2 sm:-bottom-3 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#C5F250] to-transparent"
            aria-hidden="true"
          />
        </h1>
      </div>

      {isHero && (
        <p
          className="intro-brand-tagline mt-5 sm:mt-6 text-[#7f8796] text-[10px] sm:text-xs uppercase tracking-[0.32em] sm:tracking-[0.42em] opacity-0"
          aria-hidden="true"
        >
          DevOps Portfolio Assistant
        </p>
      )}
    </div>
  );
};
