"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { NeonText } from "@/components/ui/neon-text";
import { TimelineItem } from "@/components/ui/timeline-item";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { jobs } from "@/lib/resume-data";

// Animation variants for scroll-triggered fade-in
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

function Timeline() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Alternate colors for visual variety (cooler palette)
  const timelineColors: Array<"cyan" | "electric" | "purple" | "ice"> = [
    "cyan",
    "electric",
    "purple",
    "ice",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Vertical Neon Line - Gradient from cyan to magenta */}
      <div
        className="absolute left-4 md:left-8 lg:left-[calc(50%-24rem)] top-32 bottom-32 w-0.5 hidden md:block"
        style={{
          background: `linear-gradient(
            to bottom,
            var(--neon-cyan),
            var(--neon-magenta)
          )`,
          boxShadow: `
            0 0 10px var(--neon-cyan),
            0 0 20px var(--neon-magenta)
          `,
          opacity: 0.6,
        }}
      />

      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section Heading with Glitch */}
        <motion.div variants={itemVariants} className="mb-12">
          <GlitchWrapper intensity="subtle" trigger="random" delayVariant={2}>
            <NeonText
              as="h2"
              color="cyan"
              intensity="normal"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase"
            >
              Experience
            </NeonText>
          </GlitchWrapper>
        </motion.div>

        {/* Timeline Items */}
        <motion.div variants={itemVariants} className="relative">
          {jobs.map((job, index) => (
            <TimelineItem
              key={job.id}
              job={{
                company: job.company,
                title: job.title,
                dates: `${job.startDate} - ${job.endDate}`,
                description: job.description,
                isCurrent: job.isCurrent,
              }}
              index={index}
              color={timelineColors[index % timelineColors.length]}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export { Timeline };
