"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { NeonText } from "@/components/ui/neon-text";
import { HolographicCard } from "@/components/ui/holographic-card";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { aboutSummary, personalInfo } from "@/lib/resume-data";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon, Mail01Icon, Link01Icon } from "@hugeicons/core-free-icons";

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

interface ContactBadgeProps {
  icon: typeof Location01Icon;
  label: string;
  href?: string;
}

function ContactBadge({ icon, label, href }: ContactBadgeProps) {
  const content = (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 glitch-on-hover"
      style={{
        background: "rgba(10, 10, 15, 0.6)",
        border: "1px solid var(--neon-ice)",
        boxShadow: `
          0 0 8px rgba(130, 200, 255, 0.2),
          inset 0 0 8px rgba(130, 200, 255, 0.05)
        `,
        color: "var(--neon-ice)",
      }}
    >
      <HugeiconsIcon
        icon={icon}
        size={16}
        strokeWidth={2}
        style={{ color: "var(--neon-ice)" }}
      />
      <span>{label}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return content;
}

function About() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4"
      style={{ backgroundColor: "var(--cyber-dark)" }}
    >
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section Heading with Glitch */}
        <motion.div variants={itemVariants} className="mb-12">
          <GlitchWrapper intensity="subtle" trigger="random" delayVariant={3}>
            <NeonText
              as="h2"
              color="ice"
              intensity="normal"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase"
            >
              About
            </NeonText>
          </GlitchWrapper>
        </motion.div>

        {/* Holographic Card Container */}
        <motion.div variants={itemVariants}>
          <HolographicCard hoverEffect={false}>
            {/* Professional Summary */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-8"
              style={{ color: "rgba(255, 255, 255, 0.85)" }}
            >
              {aboutSummary}
            </p>

            {/* Contact Info Badges */}
            <div className="flex flex-wrap gap-3 justify-center">
              <ContactBadge
                icon={Location01Icon}
                label={personalInfo.location}
              />
              <ContactBadge
                icon={Mail01Icon}
                label={personalInfo.email}
                href={`mailto:${personalInfo.email}`}
              />
              <ContactBadge
                icon={Link01Icon}
                label="LinkedIn"
                href={`https://${personalInfo.linkedin}`}
              />
            </div>
          </HolographicCard>
        </motion.div>
      </motion.div>
    </section>
  );
}

export { About };
