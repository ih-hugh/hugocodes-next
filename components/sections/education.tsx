"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { NeonText } from "@/components/ui/neon-text";
import { HolographicCard } from "@/components/ui/holographic-card";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { education } from "@/lib/resume-data";
import { HugeiconsIcon } from "@hugeicons/react";
import { UniversityIcon, GraduateMaleIcon } from "@hugeicons/core-free-icons";

// Animation variants for scroll-triggered fade-in
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

// Map institution IDs to icons
const institutionIconMap: Record<string, typeof UniversityIcon> = {
  fiu: UniversityIcon,
  mdc: GraduateMaleIcon,
};

// Map institution IDs to neon colors for variety (cooler colors)
const institutionColorMap: Record<string, "cyan" | "electric" | "purple" | "ice"> = {
  fiu: "electric",
  mdc: "ice",
};

interface EducationCardProps {
  institution: string;
  degree: string;
  field: string;
  location: string;
  year: number;
  id: string;
}

function EducationCard({ institution, degree, field, location, year, id }: EducationCardProps) {
  const icon = institutionIconMap[id] || UniversityIcon;
  const color = institutionColorMap[id] || "cyan";
  const colorVar = `var(--neon-${color})`;

  return (
    <HolographicCard
      hoverEffect={true}
      className="flex-1 min-w-0 sm:min-w-[340px] glitch-on-hover"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="p-3 rounded-lg shrink-0"
          style={{
            background: `rgba(${color === "cyan" ? "0, 255, 255" : color === "purple" ? "180, 0, 255" : "255, 0, 255"}, 0.1)`,
            border: `1px solid ${colorVar}`,
            boxShadow: `0 0 10px ${colorVar}40`,
          }}
        >
          <HugeiconsIcon
            icon={icon}
            size={24}
            strokeWidth={1.5}
            style={{ color: colorVar }}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <NeonText
            as="h3"
            color={color}
            intensity="subtle"
            animate={false}
            className="text-base sm:text-lg font-semibold"
          >
            {institution}
          </NeonText>
          <p
            className="text-sm mt-1"
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            {degree} {field}
          </p>
          <p
            className="text-sm font-mono mt-2"
            style={{ color: colorVar, opacity: 0.8 }}
          >
            {year}
          </p>
        </div>
      </div>
    </HolographicCard>
  );
}

function Education() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4"
      style={{ backgroundColor: "transparent" }}
    >
      <motion.div
        className="max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section Heading with Glitch */}
        <motion.div variants={itemVariants} className="mb-12">
          <GlitchWrapper intensity="subtle" trigger="random" delayVariant={3}>
            <NeonText
              as="h2"
              color="green"
              intensity="normal"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase"
            >
              Education
            </NeonText>
          </GlitchWrapper>
        </motion.div>

        {/* Education Cards Grid */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6"
        >
          {education.map((edu) => (
            <EducationCard
              key={edu.id}
              id={edu.id}
              institution={edu.institution}
              degree={edu.degree}
              field={edu.field}
              location={edu.location}
              year={edu.year}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Education };
