"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { NeonText } from "@/components/ui/neon-text";
import { SkillBar } from "@/components/ui/skill-bar";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { skills } from "@/lib/resume-data";

// Animation variants for scroll-triggered fade-in
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
} as const;

// Map skill categories to neon colors
const categoryColorMap: Record<string, "cyan" | "magenta" | "purple" | "green" | "orange" | "ice" | "electric" | "red"> = {
  Frontend: "cyan",
  Backend: "magenta",
  Data: "purple",
  "Cloud/DevOps": "green",
  Practices: "orange",
  "Soft Skills": "ice",
};

function Skills() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4"
      style={{ backgroundColor: "transparent" }}
    >
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section Heading with Glitch */}
        <motion.div variants={itemVariants} className="mb-12">
          <GlitchWrapper intensity="subtle" trigger="random" delayVariant={4}>
            <NeonText
              as="h2"
              color="purple"
              intensity="normal"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase"
            >
              Skills
            </NeonText>
          </GlitchWrapper>
        </motion.div>

        {/* Skills Grid */}
        <motion.div variants={itemVariants} className="space-y-8">
          {skills.map((skill, index) => (
            <SkillBar
              key={skill.id}
              data={{
                category: skill.category,
                skills: skill.skills.map((s) => ({
                  name: s,
                  proficiency: skill.proficiency,
                })),
              }}
              color={categoryColorMap[skill.category] || "cyan"}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Skills };
