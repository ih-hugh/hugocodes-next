"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { NeonText } from "@/components/ui/neon-text";
import { skills, type Skill } from "@/lib/resume-data";

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

const categoryColors: Record<string, string> = {
  Frontend: "var(--neon-cyan)",
  Backend: "var(--neon-magenta)",
  Data: "var(--neon-purple)",
  "Cloud/DevOps": "var(--neon-green)",
  Practices: "var(--neon-orange)",
  "Soft Skills": "var(--neon-ice)",
  Marketing: "var(--neon-electric)",
};

function SkillNode({ name, color, index }: { name: string; color: string; index: number }) {
  return (
    <motion.span
      className="inline-flex items-center rounded-full border bg-black/24 px-3 py-1.5 text-xs font-medium text-white/68"
      style={{
        borderColor: `color-mix(in oklch, ${color} 28%, transparent)`,
        boxShadow: `0 0 14px color-mix(in oklch, ${color} 10%, transparent)`,
      }}
      initial={{ opacity: 0, scale: 0.86 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.035, duration: 0.35 }}
    >
      {name}
    </motion.span>
  );
}

function SkillCluster({ skill, index }: { skill: Skill; index: number }) {
  const color = categoryColors[skill.category] ?? "var(--neon-cyan)";
  const angle = `${Math.round(skill.proficiency * 3.6)}deg`;

  return (
    <motion.article
      className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[rgba(5,5,8,0.64)] p-5 backdrop-blur-xl transition-colors hover:border-white/20 sm:p-6"
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
    >
      <div
        className="absolute -right-12 -top-16 size-44 rounded-full opacity-55 blur-3xl transition-opacity duration-500 group-hover:opacity-85"
        style={{ background: `color-mix(in oklch, ${color} 18%, transparent)` }}
      />
      <div
        className="absolute inset-0 opacity-28"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 flex items-start gap-5">
        <div className="relative size-20 shrink-0 sm:size-24">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${color} ${angle}, rgba(255,255,255,0.08) 0deg)`,
              boxShadow: `0 0 28px color-mix(in oklch, ${color} 18%, transparent)`,
            }}
          />
          <div className="absolute inset-2 rounded-full bg-[rgba(5,5,8,0.95)]" />
          <motion.div
            className="absolute inset-0 rounded-full border border-white/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 28 + index * 2, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold" style={{ color }}>
            {skill.proficiency}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black uppercase tracking-[-0.035em] text-white sm:text-2xl">
              {skill.category}
            </h3>
            <span
              className="rounded-full border px-2.5 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em]"
              style={{
                borderColor: `color-mix(in oklch, ${color} 34%, transparent)`,
                color,
                background: `color-mix(in oklch, ${color} 8%, transparent)`,
              }}
            >
              signal {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <p className="mb-5 text-sm leading-7 text-white/52">
            Proficiency cluster calibrated from production usage, ownership, and
            delivery depth.
          </p>
          <div className="flex flex-wrap gap-2">
            {skill.skills.map((name, skillIndex) => (
              <SkillNode
                key={name}
                name={name}
                color={color}
                index={skillIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Skills() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-120px" });
  const averageSignal = Math.round(
    skills.reduce((total, skill) => total + skill.proficiency, 0) / skills.length
  );
  const totalSkills = skills.reduce((total, skill) => total + skill.skills.length, 0);

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
            "radial-gradient(circle at 82% 18%, color-mix(in oklch, var(--neon-purple) 13%, transparent), transparent 30%), radial-gradient(circle at 20% 80%, color-mix(in oklch, var(--neon-green) 10%, transparent), transparent 28%)",
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
            <div className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-[var(--neon-purple)]/75">
              Capability matrix
            </div>
            <GlitchWrapper intensity="subtle" trigger="random" delayVariant={4}>
              <NeonText
                as="h2"
                color="purple"
                intensity="normal"
                className="text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl md:text-7xl"
              >
                Skills
              </NeonText>
            </GlitchWrapper>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              A practical systems map across interface work, APIs, data,
              infrastructure, product delivery, and growth loops.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] border border-white/10 bg-[rgba(5,5,8,0.58)] p-4 backdrop-blur-xl">
            <div>
              <div className="font-mono text-2xl font-bold text-[var(--neon-purple)]">
                {skills.length}
              </div>
              <div className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/36">
                clusters
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[var(--neon-cyan)]">
                {totalSkills}
              </div>
              <div className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/36">
                signals
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[var(--neon-green)]">
                {averageSignal}
              </div>
              <div className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/36">
                avg
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} className="grid gap-5 lg:grid-cols-2">
          {skills.map((skill, index) => (
            <SkillCluster key={skill.id} skill={skill} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Skills };
