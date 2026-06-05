"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { NeonText } from "@/components/ui/neon-text";
import { jobs, type Job } from "@/lib/resume-data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

const routeColors = [
  "var(--neon-cyan)",
  "var(--neon-electric)",
  "var(--neon-purple)",
  "var(--neon-ice)",
  "var(--neon-green)",
  "var(--neon-orange)",
] as const;

function formatDates(job: Job) {
  return `${job.startDate} - ${job.endDate}`;
}

function getVisibleDescriptions(job: Job, index: number) {
  if (job.isCurrent) {
    return job.description.slice(0, 4);
  }

  return job.description.slice(0, index < 4 ? 3 : 2);
}

function RouteNode({ index, color, active }: { index: number; color: string; active: boolean }) {
  return (
    <div className="relative flex w-12 shrink-0 justify-center sm:w-16">
      <motion.div
        className="relative z-10 flex size-9 items-center justify-center rounded-full border bg-[rgba(5,5,8,0.92)] font-mono text-xs font-bold"
        style={{
          borderColor: `color-mix(in oklch, ${color} 58%, transparent)`,
          boxShadow: `0 0 24px color-mix(in oklch, ${color} 24%, transparent)`,
          color,
        }}
        animate={
          active
            ? {
                scale: [1, 1.08, 1],
                boxShadow: [
                  `0 0 18px color-mix(in oklch, ${color} 20%, transparent)`,
                  `0 0 34px color-mix(in oklch, ${color} 38%, transparent)`,
                  `0 0 18px color-mix(in oklch, ${color} 20%, transparent)`,
                ],
              }
            : undefined
        }
        transition={active ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.div>
      {active && (
        <span
          className="absolute top-1/2 size-12 -translate-y-1/2 rounded-full opacity-25 blur-md"
          style={{ background: color }}
        />
      )}
    </div>
  );
}

function ExperienceCard({ job, index }: { job: Job; index: number }) {
  const color = routeColors[index % routeColors.length];
  const descriptions = getVisibleDescriptions(job, index);

  return (
    <motion.article
      className="group relative flex gap-4 sm:gap-6"
      variants={itemVariants}
    >
      <div className="absolute left-6 top-10 bottom-[-2.25rem] w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent sm:left-8" />
      <RouteNode index={index} color={color} active={job.isCurrent} />

      <motion.div
        className="relative flex-1 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgba(5,5,8,0.66)] p-5 backdrop-blur-xl transition-colors group-hover:border-white/20 sm:p-6"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
      >
        <div
          className="absolute -right-12 -top-16 size-40 rounded-full opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
          style={{ background: `color-mix(in oklch, ${color} 18%, transparent)` }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-45" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div
                className="mb-2 font-mono text-xs uppercase tracking-[0.22em]"
                style={{ color }}
              >
                {job.company}
              </div>
              <h3 className="text-xl font-black uppercase tracking-[-0.035em] text-white sm:text-2xl">
                {job.title}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {job.isCurrent && (
                <span className="rounded-full border border-[var(--neon-green)]/34 bg-[var(--neon-green)]/[0.06] px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--neon-green)]">
                  Current
                </span>
              )}
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/42">
                {formatDates(job)}
              </span>
            </div>
          </div>

          <ul className="space-y-3">
            {descriptions.map((description, descriptionIndex) => (
              <li key={description} className="flex gap-3 text-sm leading-7 text-white/62">
                <span
                  className="mt-3 size-1.5 shrink-0 rounded-full shadow-[0_0_10px_currentColor]"
                  style={{ background: color, color }}
                />
                <span>{description}</span>
                {descriptionIndex === descriptions.length - 1 &&
                  descriptions.length < job.description.length && (
                    <span className="sr-only">
                      Additional role details omitted from visual summary.
                    </span>
                  )}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.article>
  );
}

function Timeline() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-120px" });
  const currentRoles = jobs.filter((job) => job.isCurrent).length;
  const firstYear = jobs[jobs.length - 1]?.startDate.match(/\d{4}/)?.[0] ?? "2014";

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
            "radial-gradient(circle at 14% 16%, color-mix(in oklch, var(--neon-cyan) 13%, transparent), transparent 28%), radial-gradient(circle at 78% 42%, color-mix(in oklch, var(--neon-purple) 10%, transparent), transparent 30%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-12 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-[var(--neon-cyan)]/75">
              Route history
            </div>
            <GlitchWrapper intensity="subtle" trigger="random" delayVariant={2}>
              <NeonText
                as="h2"
                color="cyan"
                intensity="normal"
                className="text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl md:text-7xl"
              >
                Experience
              </NeonText>
            </GlitchWrapper>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              A decade-plus route through product engineering, enterprise
              systems, fintech, insurance, AI products, and full-stack ownership.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] border border-white/10 bg-[rgba(5,5,8,0.58)] p-4 backdrop-blur-xl">
            <div>
              <div className="font-mono text-2xl font-bold text-[var(--neon-cyan)]">
                {jobs.length}
              </div>
              <div className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/36">
                nodes
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[var(--neon-green)]">
                {currentRoles}
              </div>
              <div className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/36">
                active
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[var(--neon-ice)]">
                {firstYear}
              </div>
              <div className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/36">
                since
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-7">
          {jobs.map((job, index) => (
            <ExperienceCard key={job.id} job={job} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Timeline };
