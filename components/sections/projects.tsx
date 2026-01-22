"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { NeonText } from "@/components/ui/neon-text";
import { HolographicCard } from "@/components/ui/holographic-card";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { projects } from "@/lib/resume-data";

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

interface TechBadgeProps {
  tech: string;
  index: number;
}

function TechBadge({ tech, index }: TechBadgeProps) {
  // Rotate through neon colors for variety (replaced pink with cooler colors)
  const colors = [
    { bg: "var(--neon-cyan)", text: "var(--neon-cyan)" },
    { bg: "var(--neon-electric)", text: "var(--neon-electric)" },
    { bg: "var(--neon-purple)", text: "var(--neon-purple)" },
    { bg: "var(--neon-ice)", text: "var(--neon-ice)" },
    { bg: "var(--neon-green)", text: "var(--neon-green)" },
    { bg: "var(--neon-red)", text: "var(--neon-red)" },
  ];
  const color = colors[index % colors.length];

  return (
    <span
      className="inline-block px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 hover:scale-105"
      style={{
        background: `color-mix(in oklch, ${color.bg} 15%, transparent)`,
        color: color.text,
        border: `1px solid color-mix(in oklch, ${color.bg} 40%, transparent)`,
        boxShadow: `0 0 8px color-mix(in oklch, ${color.bg} 30%, transparent)`,
      }}
    >
      {tech}
    </span>
  );
}

// Holographic "Coming Soon" badge component
function ComingSoonBadge() {
  return (
    <motion.span
      className="absolute top-4 right-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full"
      style={{
        background: `linear-gradient(
          135deg,
          rgba(180, 0, 255, 0.3),
          rgba(0, 255, 255, 0.3),
          rgba(255, 0, 255, 0.3)
        )`,
        backgroundSize: "200% 200%",
        animation: "holographic-shift 3s ease-in-out infinite",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        color: "white",
        boxShadow: `
          0 0 10px rgba(180, 0, 255, 0.4),
          0 0 20px rgba(0, 255, 255, 0.2),
          inset 0 0 10px rgba(255, 255, 255, 0.1)
        `,
        backdropFilter: "blur(4px)",
      }}
      animate={{
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      Coming Soon
    </motion.span>
  );
}

interface ProjectCardProps {
  name: string;
  description: string;
  techStack: string[];
  url?: string;
}

function ProjectCard({ name, description, techStack, url }: ProjectCardProps) {
  const isComingSoon = !url;

  const cardContent = (
    <HolographicCard className="h-full relative glitch-on-hover">
      {/* Coming Soon Badge */}
      {isComingSoon && <ComingSoonBadge />}

      {/* Project Name with Glitch Effect */}
      <GlitchWrapper intensity="subtle" trigger="hover">
        <h3
          className="glitch-hover text-xl sm:text-2xl font-bold mb-4 cursor-pointer"
          style={{ color: "var(--neon-electric)" }}
        >
          {name}
        </h3>
      </GlitchWrapper>

      {/* Description */}
      <p
        className="text-sm sm:text-base leading-relaxed mb-6"
        style={{ color: "rgba(255, 255, 255, 0.75)" }}
      >
        {description}
      </p>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech, index) => (
          <TechBadge key={tech} tech={tech} index={index} />
        ))}
      </div>
    </HolographicCard>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

function Projects() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4"
      style={{ backgroundColor: "var(--cyber-dark)" }}
    >
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section Heading with Glitch */}
        <motion.div variants={itemVariants} className="mb-12">
          <GlitchWrapper intensity="subtle" trigger="random" delayVariant={2}>
            <NeonText
              as="h2"
              color="electric"
              intensity="normal"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase"
            >
              Projects
            </NeonText>
          </GlitchWrapper>
        </motion.div>

        {/* Projects Grid - 2 columns on desktop, stacked on mobile */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              description={project.description}
              techStack={project.techStack}
              url={project.url}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Projects };
