"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { NeonText } from "@/components/ui/neon-text";
import { projects, type Project } from "@/lib/resume-data";

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

const signalMetrics = [
  { label: "Market feed", value: "Realtime" },
  { label: "Research", value: "AI reports" },
  { label: "Delivery", value: "Multi-channel" },
] as const;

const projectColors = [
  "var(--neon-cyan)",
  "var(--neon-electric)",
  "var(--neon-purple)",
  "var(--neon-ice)",
  "var(--neon-green)",
  "var(--neon-red)",
] as const;

interface TechBadgeProps {
  tech: string;
  index: number;
  compact?: boolean;
}

function TechBadge({ tech, index, compact = false }: TechBadgeProps) {
  const color = projectColors[index % projectColors.length];

  return (
    <span
      className="inline-flex items-center rounded-full border font-mono font-medium"
      style={{
        background: `color-mix(in oklch, ${color} 12%, transparent)`,
        borderColor: `color-mix(in oklch, ${color} 34%, transparent)`,
        boxShadow: `0 0 12px color-mix(in oklch, ${color} 18%, transparent)`,
        color,
        fontSize: compact ? "0.65rem" : "0.72rem",
        padding: compact ? "0.34rem 0.58rem" : "0.42rem 0.72rem",
      }}
    >
      {tech}
    </span>
  );
}

function StatusPill({ project }: { project: Project }) {
  const isLive = Boolean(project.url);

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[0.66rem] font-bold uppercase tracking-[0.2em]"
      style={{
        background: isLive
          ? "color-mix(in oklch, var(--neon-green) 10%, transparent)"
          : "color-mix(in oklch, var(--neon-purple) 12%, transparent)",
        borderColor: isLive
          ? "color-mix(in oklch, var(--neon-green) 42%, transparent)"
          : "color-mix(in oklch, var(--neon-purple) 42%, transparent)",
        color: isLive ? "var(--neon-green)" : "var(--neon-purple)",
      }}
    >
      <span className="size-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
      {isLive ? "Live" : "Building"}
    </span>
  );
}

function FlagshipProject({ project }: { project: Project }) {
  const cardContent = (
    <motion.article
      className="group relative overflow-hidden rounded-[2rem] border border-[var(--neon-cyan)]/25 bg-[rgba(5,5,8,0.72)] p-5 shadow-[0_0_80px_rgba(0,255,255,0.1)] backdrop-blur-2xl sm:p-7 lg:p-8"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      <div className="absolute -inset-1 rounded-[2rem] bg-[linear-gradient(120deg,transparent,var(--neon-cyan),var(--neon-electric),transparent)] opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-35" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent" />
      <div
        className="absolute inset-0 opacity-45"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(circle at 68% 38%, black 0%, transparent 64%)",
        }}
      />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StatusPill project={project} />
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[0.66rem] font-bold uppercase tracking-[0.2em] text-white/42">
              Flagship build
            </span>
          </div>

          <GlitchWrapper intensity="subtle" trigger="hover">
            <h3 className="glitch-on-hover max-w-2xl text-3xl font-black uppercase tracking-[-0.06em] text-[var(--neon-cyan)] sm:text-5xl lg:text-6xl">
              {project.name}
            </h3>
          </GlitchWrapper>

          <p className="mt-6 max-w-3xl text-sm leading-7 text-white/68 sm:text-base sm:leading-8">
            {project.description}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {project.url && (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[var(--neon-cyan)]/60 bg-[var(--neon-cyan)]/[0.08] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--neon-cyan)] shadow-[0_0_24px_rgba(0,255,255,0.12)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)]"
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
              >
                Open system
              </motion.a>
            )}
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white/64 transition-colors hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)]"
            >
              Discuss build
            </a>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 p-4 shadow-[inset_0_0_40px_rgba(0,255,255,0.04)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,255,255,0.16),transparent_44%)]" />
          <motion.div
            className="absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--neon-cyan)]/45"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--neon-electric)]/25"
            animate={{ rotate: -360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--neon-cyan)]/10 shadow-[0_0_80px_rgba(0,255,255,0.28)]"
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 grid h-full content-between gap-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/38 p-3 backdrop-blur-md">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--neon-cyan)]">
                Intelligence core
              </span>
              <span className="font-mono text-xs text-white/34">v1.0</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {signalMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-black/42 p-4 backdrop-blur-md"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.12, duration: 0.5 }}
                >
                  <div className="font-mono text-lg font-bold text-[var(--neon-ice)]">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-white/36">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="rounded-2xl border border-[var(--neon-electric)]/20 bg-[var(--neon-electric)]/[0.04] p-4 backdrop-blur-md">
              <div className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-[var(--neon-electric)]">
                Build stack
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <TechBadge key={tech} tech={tech} index={index} compact />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );

  if (!project.url) {
    return cardContent;
  }

  return cardContent;
}

function ProductModule({ project, index }: { project: Project; index: number }) {
  const color = projectColors[index % projectColors.length];
  const isLive = Boolean(project.url);

  const content = (
    <motion.article
      className="group relative h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgba(5,5,8,0.62)] p-5 backdrop-blur-xl transition-colors hover:border-white/20 sm:p-6"
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
    >
      <div
        className="absolute -right-12 -top-16 size-40 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-80"
        style={{ background: `color-mix(in oklch, ${color} 20%, transparent)` }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span
            className="rounded-full border px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em]"
            style={{
              borderColor: `color-mix(in oklch, ${color} 38%, transparent)`,
              color,
              background: `color-mix(in oklch, ${color} 9%, transparent)`,
            }}
          >
            Product 0{index + 1}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/32">
            {isLive ? "Live" : "In build"}
          </span>
        </div>

        <h3 className="text-2xl font-black uppercase tracking-[-0.04em] text-white sm:text-3xl">
          {project.name}
        </h3>
        <p className="mt-4 line-clamp-none text-sm leading-7 text-white/62">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.slice(0, 8).map((tech, techIndex) => (
            <TechBadge key={tech} tech={tech} index={techIndex + index} compact />
          ))}
        </div>

        <div className="mt-auto pt-7">
          {project.url ? (
            <span
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors group-hover:text-white"
              style={{ color }}
            >
              Visit product
              <span aria-hidden="true">/</span>
            </span>
          ) : (
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/35">
              Coming soon
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );

  if (!project.url) {
    return content;
  }

  return (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="block h-full">
      {content}
    </a>
  );
}

function Projects() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-120px" });
  const flagshipProject = projects.find((project) => project.id === "frontier-terminal");
  const productModules = projects.filter((project) => project.id !== "frontier-terminal");

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
            "radial-gradient(circle at 18% 20%, color-mix(in oklch, var(--neon-electric) 14%, transparent), transparent 30%), radial-gradient(circle at 82% 10%, color-mix(in oklch, var(--neon-purple) 12%, transparent), transparent 28%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-12 max-w-4xl">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-[var(--neon-electric)]/75">
            Selected systems
          </div>
          <GlitchWrapper intensity="subtle" trigger="random" delayVariant={2}>
            <NeonText
              as="h2"
              color="electric"
              intensity="normal"
              className="text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl md:text-7xl"
            >
              Projects
            </NeonText>
          </GlitchWrapper>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
            Products built as operating systems: commerce, mobile guidance,
            financial intelligence, agent workflows, realtime delivery, and full
            production ownership.
          </p>
        </motion.div>

        {flagshipProject && (
          <motion.div variants={itemVariants}>
            <FlagshipProject project={flagshipProject} />
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {productModules.map((project, index) => (
            <ProductModule key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Projects };
