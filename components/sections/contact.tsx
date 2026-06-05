"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { NeonText } from "@/components/ui/neon-text";
import { personalInfo } from "@/lib/resume-data";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
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

const contactLinks = [
  {
    id: "email",
    label: "Email",
    detail: personalInfo.email,
    icon: Mail01Icon,
    href: `mailto:${personalInfo.email}`,
    color: "var(--neon-cyan)",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    detail: personalInfo.linkedin,
    icon: Linkedin01Icon,
    href: `https://${personalInfo.linkedin}`,
    color: "var(--neon-electric)",
  },
  {
    id: "x",
    label: "X",
    detail: "@ih_hugh",
    icon: NewTwitterIcon,
    href: "https://x.com/ih_hugh",
    color: "var(--neon-ice)",
  },
  {
    id: "github",
    label: "GitHub",
    detail: "ih-hugh",
    icon: GithubIcon,
    href: "https://github.com/ih-hugh",
    color: "var(--neon-purple)",
  },
] as const;

function ContactLink({ link, index }: { link: (typeof contactLinks)[number]; index: number }) {
  return (
    <motion.a
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 text-left backdrop-blur-md transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)]"
      whileHover={{ y: -5, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
    >
      <div
        className="absolute -right-10 -top-14 size-32 rounded-full opacity-45 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
        style={{ background: `color-mix(in oklch, ${link.color} 22%, transparent)` }}
      />
      <div className="relative z-10 flex items-center gap-4">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl border bg-black/24"
          style={{ borderColor: `color-mix(in oklch, ${link.color} 40%, transparent)` }}
        >
          <HugeiconsIcon icon={link.icon} size={24} strokeWidth={1.7} style={{ color: link.color }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/35">
              0{index + 1}
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.12em] text-white">
              {link.label}
            </span>
          </div>
          <div className="mt-1 truncate text-sm text-white/52">{link.detail}</div>
        </div>
      </div>
    </motion.a>
  );
}

function Contact() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-120px" });
  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={sectionRef}
      className="relative px-4 py-24 sm:px-6 md:py-32 lg:px-8"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 18%, color-mix(in oklch, var(--neon-red) 10%, transparent), transparent 28%), radial-gradient(circle at 80% 72%, color-mix(in oklch, var(--neon-cyan) 10%, transparent), transparent 30%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2rem] border border-[var(--neon-red)]/18 bg-[rgba(5,5,8,0.74)] p-6 shadow-[0_0_80px_rgba(255,60,60,0.06)] backdrop-blur-2xl sm:p-8 lg:p-10"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-red)] to-transparent opacity-70" />
          <div
            className="absolute inset-0 opacity-35"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "radial-gradient(circle at 52% 30%, black 0%, transparent 72%)",
            }}
          />

          <div className="relative z-10 grid gap-9 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div>
              <div className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-[var(--neon-red)]/75">
                Transmission endpoint
              </div>
              <GlitchWrapper intensity="subtle" trigger="random" delayVariant={5}>
                <NeonText
                  as="h2"
                  color="red"
                  intensity="normal"
                  className="text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl md:text-7xl"
                >
                  Let&apos;s Connect
                </NeonText>
              </GlitchWrapper>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                Open to conversations around product engineering, AI-native
                software, full-stack systems, and ambitious builds that need a
                senior operator who can move across the whole stack.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center justify-center rounded-full border border-[var(--neon-cyan)]/55 bg-[var(--neon-cyan)]/[0.07] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--neon-cyan)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)]"
                >
                  Send email
                </a>
                <a
                  href="#hero"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white/58 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)]"
                >
                  Return top
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {contactLinks.map((link, index) => (
                <ContactLink key={link.id} link={link} index={index} />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-white/30 sm:flex-row sm:items-center sm:justify-between sm:text-left"
        >
          <span>
            &copy; {currentYear} {personalInfo.name}. All rights reserved.
          </span>
          <span>Built with Next.js, TypeScript, Three.js, and motion.</span>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export { Contact };
