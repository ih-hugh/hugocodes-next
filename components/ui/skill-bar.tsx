"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  proficiency: number; // 0-100
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

interface SkillBarProps {
  data: SkillCategory;
  color?: "cyan" | "magenta" | "purple" | "green" | "orange" | "ice" | "electric" | "red";
  className?: string;
  /** Delay before animation starts (in seconds) */
  delay?: number;
}

const colorMap = {
  cyan: {
    gradient: "from-[var(--neon-cyan)] to-[var(--neon-cyan)]/60",
    glow: "shadow-[0_0_10px_var(--neon-cyan)]",
    tag: "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30",
    label: "text-[var(--neon-cyan)]",
  },
  magenta: {
    gradient: "from-[var(--neon-magenta)] to-[var(--neon-magenta)]/60",
    glow: "shadow-[0_0_10px_var(--neon-magenta)]",
    tag: "bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)] border-[var(--neon-magenta)]/30",
    label: "text-[var(--neon-magenta)]",
  },
  purple: {
    gradient: "from-[var(--neon-purple)] to-[var(--neon-purple)]/60",
    glow: "shadow-[0_0_10px_var(--neon-purple)]",
    tag: "bg-[var(--neon-purple)]/20 text-[var(--neon-purple)] border-[var(--neon-purple)]/30",
    label: "text-[var(--neon-purple)]",
  },
  green: {
    gradient: "from-[var(--neon-green)] to-[var(--neon-green)]/60",
    glow: "shadow-[0_0_10px_var(--neon-green)]",
    tag: "bg-[var(--neon-green)]/20 text-[var(--neon-green)] border-[var(--neon-green)]/30",
    label: "text-[var(--neon-green)]",
  },
  orange: {
    gradient: "from-[var(--neon-orange)] to-[var(--neon-orange)]/60",
    glow: "shadow-[0_0_10px_var(--neon-orange)]",
    tag: "bg-[var(--neon-orange)]/20 text-[var(--neon-orange)] border-[var(--neon-orange)]/30",
    label: "text-[var(--neon-orange)]",
  },
  ice: {
    gradient: "from-[var(--neon-ice)] to-[var(--neon-ice)]/60",
    glow: "shadow-[0_0_10px_var(--neon-ice)]",
    tag: "bg-[var(--neon-ice)]/20 text-[var(--neon-ice)] border-[var(--neon-ice)]/30",
    label: "text-[var(--neon-ice)]",
  },
  electric: {
    gradient: "from-[var(--neon-electric)] to-[var(--neon-electric)]/60",
    glow: "shadow-[0_0_10px_var(--neon-electric)]",
    tag: "bg-[var(--neon-electric)]/20 text-[var(--neon-electric)] border-[var(--neon-electric)]/30",
    label: "text-[var(--neon-electric)]",
  },
  red: {
    gradient: "from-[var(--neon-red)] to-[var(--neon-red)]/60",
    glow: "shadow-[0_0_10px_var(--neon-red)]",
    tag: "bg-[var(--neon-red)]/20 text-[var(--neon-red)] border-[var(--neon-red)]/30",
    label: "text-[var(--neon-red)]",
  },
};

function SkillBar({
  data,
  color = "cyan",
  className,
  delay = 0,
}: SkillBarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const colors = colorMap[color];

  // Calculate average proficiency for the category
  const averageProficiency =
    data.skills.reduce((sum, skill) => sum + skill.proficiency, 0) /
    data.skills.length;

  return (
    <div ref={ref} className={cn("space-y-3", className)}>
      {/* Category label */}
      <div className="flex items-center justify-between">
        <h4 className={cn("text-sm font-semibold uppercase tracking-wider", colors.label)}>
          {data.category}
        </h4>
        <span className="text-xs text-muted-foreground">
          {Math.round(averageProficiency)}%
        </span>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill) => (
          <motion.span
            key={skill.name}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-full border",
              colors.tag
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.3, delay: delay + 0.1 }}
          >
            {skill.name}
          </motion.span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
            colors.gradient,
            colors.glow
          )}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${averageProficiency}%` } : { width: 0 }}
          transition={{
            duration: 1,
            delay: delay + 0.2,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}

// Simplified single skill bar component
interface SingleSkillBarProps {
  name: string;
  proficiency: number;
  color?: "cyan" | "magenta" | "purple" | "green" | "orange" | "ice" | "electric" | "red";
  className?: string;
  delay?: number;
}

function SingleSkillBar({
  name,
  proficiency,
  color = "cyan",
  className,
  delay = 0,
}: SingleSkillBarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const colors = colorMap[color];

  return (
    <div ref={ref} className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{proficiency}%</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
            colors.gradient,
            colors.glow
          )}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${proficiency}%` } : { width: 0 }}
          transition={{
            duration: 0.8,
            delay,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}

export {
  SkillBar,
  SingleSkillBar,
  type SkillBarProps,
  type SingleSkillBarProps,
  type SkillCategory,
  type Skill,
};
