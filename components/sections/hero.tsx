"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { NeonText } from "@/components/ui/neon-text";
import { ScanLines } from "@/components/ui/scan-lines";
import { TypingEffect } from "@/components/ui/typing-effect";
import { personalInfo } from "@/lib/resume-data";

const RESUME_PDF_URL =
  "https://wnennfwlfsbuiwjq.public.blob.vercel-storage.com/resumes/HugoCedanoSE2026.pdf";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.15,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
} as const;

const scrollIndicatorVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 2,
      duration: 0.5,
    },
  },
} as const;

const heroStats = [
  { value: personalInfo.yearsExperience, label: "years shipping" },
  { value: "3", label: "AI-native products" },
  { value: "Full", label: "stack ownership" },
] as const;

const terminalLines = [
  "boot --profile=hugo_cedano",
  "connect --stack=react,next,node,postgres,aws",
  "render --mode=webgl_neural_field",
  "focus --target=agentic_product_systems",
] as const;

const stackSignals = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Supabase",
  "AWS",
  "AI SDKs",
] as const;

interface HeroLinkProps {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
}

function HeroLink({ href, label, variant = "secondary", external = false }: HeroLinkProps) {
  const styles = {
    primary: {
      background:
        "linear-gradient(135deg, color-mix(in oklch, var(--neon-cyan) 24%, transparent), color-mix(in oklch, var(--neon-electric) 18%, transparent))",
      border: "1px solid color-mix(in oklch, var(--neon-cyan) 70%, transparent)",
      boxShadow:
        "0 0 22px color-mix(in oklch, var(--neon-cyan) 32%, transparent), inset 0 0 18px rgba(255,255,255,0.04)",
      color: "var(--neon-cyan)",
    },
    secondary: {
      background: "rgba(10, 10, 15, 0.58)",
      border: "1px solid color-mix(in oklch, var(--neon-ice) 42%, transparent)",
      boxShadow: "inset 0 0 16px rgba(255,255,255,0.035)",
      color: "var(--neon-ice)",
    },
    ghost: {
      background: "rgba(10, 10, 15, 0.22)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "rgba(255,255,255,0.72)",
    },
  }[variant];

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)] sm:px-6"
      style={styles}
      whileHover={{ y: -2, scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.a>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-md">
      <div className="font-mono text-2xl font-bold text-[var(--neon-cyan)] sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-[0.22em] text-white/45">
        {label}
      </div>
    </div>
  );
}

function TerminalPanel() {
  return (
    <motion.div variants={itemVariants} className="relative hidden lg:block">
      <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--neon-cyan)_22%,transparent),transparent_64%)] blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(5,5,8,0.72)] p-5 shadow-[0_0_60px_rgba(0,255,255,0.08)] backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-70" />
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[var(--neon-red)] shadow-[0_0_10px_var(--neon-red)]" />
            <span className="size-2.5 rounded-full bg-[var(--neon-orange)] shadow-[0_0_10px_var(--neon-orange)]" />
            <span className="size-2.5 rounded-full bg-[var(--neon-green)] shadow-[0_0_10px_var(--neon-green)]" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-white/35">
            neural-workbench
          </span>
        </div>

        <div className="mt-5 space-y-3 font-mono text-sm">
          {terminalLines.map((line, index) => (
            <motion.div
              key={line}
              className="flex items-start gap-3 text-white/62"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 + index * 0.18, duration: 0.45 }}
            >
              <span className="text-[var(--neon-cyan)]">$</span>
              <span>{line}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-[var(--neon-electric)]/25 bg-[var(--neon-electric)]/[0.04] p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-[var(--neon-electric)]">
            active stack signals
          </div>
          <div className="flex flex-wrap gap-2">
            {stackSignals.map((signal) => (
              <span
                key={signal}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/64"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center"
            >
              <div className="font-mono text-lg font-bold text-[var(--neon-ice)]">
                {stat.value}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/34">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  const [showTypingEffect, setShowTypingEffect] = React.useState(false);
  const [isInitialGlitching, setIsInitialGlitching] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypingEffect(true);
    }, 850);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsInitialGlitching(true);
    }, 260);

    const stopTimer = setTimeout(() => {
      setIsInitialGlitching(false);
    }, 820);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      style={{ backgroundColor: "transparent" }}
    >
      <ScanLines opacity={0.025} />

      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, transparent 0%, rgba(5, 5, 8, 0.18) 44%, var(--cyber-dark) 92%)",
        }}
      />

      <motion.div
        className="relative z-20 mx-auto grid min-h-[calc(100vh-10rem)] max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl">
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/[0.05] px-4 py-2 font-mono text-xs uppercase tracking-[0.26em] text-[var(--neon-cyan)] shadow-[0_0_24px_rgba(0,255,255,0.08)]"
          >
            <span className="size-2 rounded-full bg-[var(--neon-green)] shadow-[0_0_12px_var(--neon-green)]" />
            System online
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlitchWrapper intensity="subtle" trigger="hover">
              <div
                className="relative glitch-on-hover"
                style={
                  isInitialGlitching
                    ? { animation: "glitch-intense 0.56s ease-in-out" }
                    : undefined
                }
              >
                <NeonText
                  as="h1"
                  color="cyan"
                  intensity="intense"
                  className="max-w-5xl text-5xl font-black uppercase tracking-[-0.08em] sm:text-7xl md:text-8xl lg:text-9xl"
                >
                  {personalInfo.name}
                </NeonText>
              </div>
            </GlitchWrapper>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-6 min-h-9 font-mono text-xl text-white/78 sm:text-2xl md:text-3xl"
          >
            {showTypingEffect && (
              <TypingEffect
                text={`${personalInfo.title} // AI-native product systems`}
                speed={38}
                showCursor
                cursor="_"
              />
            )}
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-7 max-w-2xl text-base leading-8 text-white/66 sm:text-lg"
          >
            Full-stack engineer building the interfaces, backend systems, and
            agentic workflows behind modern products. I ship fast, own the full
            surface area, and turn complex systems into sharp user experiences.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <HeroLink href="#projects" label="View Projects" variant="primary" />
            <HeroLink href="#contact" label="Contact" variant="secondary" />
            <HeroLink
              href={RESUME_PDF_URL}
              label="Resume"
              variant="ghost"
              external
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 lg:hidden"
          >
            {heroStats.map((stat) => (
              <HeroStat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </motion.div>
        </div>

        <TerminalPanel />
      </motion.div>

      <motion.div
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.button
          type="button"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-[var(--neon-cyan)]/75 transition-colors hover:text-[var(--neon-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)]"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.28em]">
            Scroll
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="M19 12l-7 7-7-7" />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
}

export { Hero };
