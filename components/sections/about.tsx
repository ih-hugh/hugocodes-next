"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { NeonText } from "@/components/ui/neon-text";
import { aboutSummary, personalInfo } from "@/lib/resume-data";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Doc01Icon,
  FileDownloadIcon,
  Link01Icon,
  Location01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
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
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
} as const;

const RESUME_URLS = {
  pdf: "https://wnennfwlfsbuiwjq.public.blob.vercel-storage.com/resumes/HugoCedanoSE2026.pdf",
  docx: "https://wnennfwlfsbuiwjq.public.blob.vercel-storage.com/resumes/HugoCedanoSE2026.docx",
} as const;

const profileSignals = [
  { label: "Experience", value: personalInfo.yearsExperience },
  { label: "Stack", value: "Full" },
  { label: "Mode", value: "Agentic" },
] as const;

const operatingModes = [
  "Product engineering",
  "AI-assisted development",
  "Frontend systems",
  "Backend architecture",
  "Cloud delivery",
  "UX accessibility",
] as const;

interface ContactChipProps {
  icon: typeof Location01Icon;
  label: string;
  href?: string;
}

function ContactChip({ icon, label, href }: ContactChipProps) {
  const content = (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--neon-ice)]/28 bg-[var(--neon-ice)]/[0.045] px-4 py-2 text-sm font-medium text-[var(--neon-ice)] shadow-[0_0_18px_rgba(130,200,255,0.08)] transition-colors hover:text-white">
      <HugeiconsIcon icon={icon} size={16} strokeWidth={2} />
      <span>{label}</span>
    </span>
  );

  if (!href) {
    return content;
  }

  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)]"
    >
      {content}
    </a>
  );
}

interface DownloadButtonProps {
  label: string;
  href: string;
  filename: string;
}

function DownloadButton({ label, href, filename }: DownloadButtonProps) {
  return (
    <motion.a
      href={href}
      download={filename}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--neon-magenta)]/42 bg-[var(--neon-magenta)]/[0.06] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[var(--neon-magenta)] shadow-[0_0_22px_rgba(255,0,128,0.1)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-magenta)]"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <HugeiconsIcon icon={Doc01Icon} size={17} strokeWidth={2} />
      <span>{label}</span>
      <HugeiconsIcon icon={FileDownloadIcon} size={16} strokeWidth={2} />
    </motion.a>
  );
}

function SignalCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-md">
      <div className="font-mono text-2xl font-bold text-[var(--neon-ice)]">
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-[0.22em] text-white/38">
        {label}
      </div>
    </div>
  );
}

function About() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-120px" });

  return (
    <section
      ref={sectionRef}
      className="relative px-4 py-24 sm:px-6 md:py-32 lg:px-8"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background:
            "radial-gradient(circle at 12% 42%, color-mix(in oklch, var(--neon-ice) 12%, transparent), transparent 30%), radial-gradient(circle at 86% 60%, color-mix(in oklch, var(--neon-cyan) 10%, transparent), transparent 26%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-12 max-w-4xl">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-[var(--neon-ice)]/75">
            System profile
          </div>
          <GlitchWrapper intensity="subtle" trigger="random" delayVariant={3}>
            <NeonText
              as="h2"
              color="ice"
              intensity="normal"
              className="text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl md:text-7xl"
            >
              About
            </NeonText>
          </GlitchWrapper>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]"
        >
          <article className="relative overflow-hidden rounded-[2rem] border border-[var(--neon-ice)]/20 bg-[rgba(5,5,8,0.72)] p-6 shadow-[0_0_70px_rgba(130,200,255,0.08)] backdrop-blur-2xl sm:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-ice)] to-transparent opacity-80" />
            <div
              className="absolute inset-0 opacity-45"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "38px 38px",
                maskImage:
                  "radial-gradient(circle at 26% 32%, black 0%, transparent 68%)",
              }}
            />

            <div className="relative z-10">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--neon-green)]/32 bg-[var(--neon-green)]/[0.055] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--neon-green)]">
                  <span className="size-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
                  Available signal
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-white/42">
                  {personalInfo.location}
                </span>
              </div>

              <p className="max-w-4xl text-base leading-8 text-white/76 sm:text-lg sm:leading-9">
                {aboutSummary}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {profileSignals.map((signal) => (
                  <SignalCard
                    key={signal.label}
                    label={signal.label}
                    value={signal.value}
                  />
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                <ContactChip icon={Location01Icon} label={personalInfo.location} />
                <ContactChip
                  icon={Mail01Icon}
                  label={personalInfo.email}
                  href={`mailto:${personalInfo.email}`}
                />
                <ContactChip
                  icon={Link01Icon}
                  label="LinkedIn"
                  href={`https://${personalInfo.linkedin}`}
                />
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <DownloadButton
                  label="Resume PDF"
                  href={RESUME_URLS.pdf}
                  filename="HugoCedanoSE2026.pdf"
                />
                <DownloadButton
                  label="Resume DOCX"
                  href={RESUME_URLS.docx}
                  filename="HugoCedanoSE2026.docx"
                />
              </div>
            </div>
          </article>

          <aside className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(5,5,8,0.62)] p-6 backdrop-blur-xl">
            <div className="absolute -right-12 -top-16 size-44 rounded-full bg-[var(--neon-cyan)]/10 blur-3xl" />
            <div className="relative z-10">
              <div className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--neon-cyan)]">
                Operating modes
              </div>
              <div className="mt-5 space-y-3">
                {operatingModes.map((mode, index) => (
                  <motion.div
                    key={mode}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3"
                    initial={{ opacity: 0, x: 18 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }}
                    transition={{ delay: 0.22 + index * 0.08, duration: 0.45 }}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/[0.055] font-mono text-xs text-[var(--neon-cyan)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium text-white/66">{mode}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[var(--neon-electric)]/20 bg-[var(--neon-electric)]/[0.04] p-4">
                <div className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--neon-electric)]">
                  Current thesis
                </div>
                <p className="mt-3 text-sm leading-7 text-white/58">
                  The best engineers are becoming systems operators: shaping
                  product, infrastructure, AI workflows, and user experience as
                  one continuous loop.
                </p>
              </div>
            </div>
          </aside>
        </motion.div>
      </motion.div>
    </section>
  );
}

export { About };
