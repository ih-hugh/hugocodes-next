"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { NeonText } from "@/components/ui/neon-text";
import { education, type Education as EducationData } from "@/lib/resume-data";
import { HugeiconsIcon } from "@hugeicons/react";
import { GraduateMaleIcon, UniversityIcon } from "@hugeicons/core-free-icons";

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

const credentialMeta: Record<
  string,
  { icon: typeof UniversityIcon; color: string; signal: string }
> = {
  fiu: {
    icon: UniversityIcon,
    color: "var(--neon-green)",
    signal: "Core degree",
  },
  mdc: {
    icon: GraduateMaleIcon,
    color: "var(--neon-ice)",
    signal: "Foundation",
  },
};

function CredentialNode({ credential, index }: { credential: EducationData; index: number }) {
  const meta = credentialMeta[credential.id] ?? credentialMeta.fiu;

  return (
    <motion.article
      variants={itemVariants}
      className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[rgba(5,5,8,0.64)] p-5 backdrop-blur-xl transition-colors hover:border-white/20 sm:p-6"
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
    >
      <div
        className="absolute -right-12 -top-16 size-44 rounded-full opacity-55 blur-3xl transition-opacity duration-500 group-hover:opacity-85"
        style={{ background: `color-mix(in oklch, ${meta.color} 18%, transparent)` }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-45" />

      <div className="relative z-10 flex items-start gap-5">
        <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl border bg-black/28 sm:size-20" style={{ borderColor: `color-mix(in oklch, ${meta.color} 44%, transparent)` }}>
          <motion.div
            className="absolute inset-0 rounded-2xl border border-white/10"
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
          />
          <HugeiconsIcon icon={meta.icon} size={28} strokeWidth={1.6} style={{ color: meta.color }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em]"
              style={{
                borderColor: `color-mix(in oklch, ${meta.color} 34%, transparent)`,
                color: meta.color,
                background: `color-mix(in oklch, ${meta.color} 8%, transparent)`,
              }}
            >
              {meta.signal}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/36">
              {credential.year}
            </span>
          </div>

          <h3 className="text-xl font-black uppercase tracking-[-0.035em] text-white sm:text-2xl">
            {credential.institution}
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/62">
            {credential.degree} in {credential.field}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-white/34">
            {credential.location}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function Education() {
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
            "radial-gradient(circle at 78% 24%, color-mix(in oklch, var(--neon-green) 12%, transparent), transparent 28%), radial-gradient(circle at 18% 66%, color-mix(in oklch, var(--neon-ice) 10%, transparent), transparent 24%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-12 max-w-4xl">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-[var(--neon-green)]/75">
            Credentials
          </div>
          <GlitchWrapper intensity="subtle" trigger="random" delayVariant={3}>
            <NeonText
              as="h2"
              color="green"
              intensity="normal"
              className="text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl md:text-7xl"
            >
              Education
            </NeonText>
          </GlitchWrapper>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
            Formal computer science foundation backing the production systems,
            product interfaces, and engineering leadership shown above.
          </p>
        </motion.div>

        <motion.div variants={containerVariants} className="grid gap-5 md:grid-cols-2">
          {education.map((credential, index) => (
            <CredentialNode key={credential.id} credential={credential} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Education };
