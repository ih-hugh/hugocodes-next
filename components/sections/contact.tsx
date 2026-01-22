"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { NeonText } from "@/components/ui/neon-text";
import { GlitchWrapper } from "@/components/ui/glitch-wrapper";
import { personalInfo } from "@/lib/resume-data";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, Linkedin01Icon, Globe02Icon, NewTwitterIcon, GithubIcon } from "@hugeicons/core-free-icons";

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

// Contact link configuration (replaced pink with cooler colors)
const contactLinks = [
  {
    id: "email",
    label: "Email",
    icon: Mail01Icon,
    href: `mailto:${personalInfo.email}`,
    color: "cyan",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin01Icon,
    href: `https://${personalInfo.linkedin}`,
    color: "electric",
  },
  {
    id: "x",
    label: "X",
    icon: NewTwitterIcon,
    href: "https://x.com/ih_hugh",
    color: "ice",
  },
  {
    id: "github",
    label: "GitHub",
    icon: GithubIcon,
    href: "https://github.com/ih-hugh",
    color: "purple",
  },
] as const;

type NeonColor = "cyan" | "magenta" | "purple" | "green" | "orange" | "ice" | "electric" | "red";

interface ContactLinkProps {
  icon: typeof Mail01Icon;
  label: string;
  href: string;
  color: NeonColor;
}

function ContactLink({ icon, label, href, color }: ContactLinkProps) {
  const colorVar = `var(--neon-${color})`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-3 p-4 rounded-lg transition-all duration-300 glitch-on-hover"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: "rgba(10, 10, 15, 0.6)",
      }}
    >
      {/* Icon with neon glow on hover */}
      <div
        className="relative p-4 rounded-full transition-all duration-300 group-hover:shadow-lg"
        style={{
          border: `2px solid ${colorVar}`,
          boxShadow: `0 0 10px ${colorVar}40`,
        }}
      >
        <HugeiconsIcon
          icon={icon}
          size={28}
          strokeWidth={1.5}
          className="transition-all duration-300"
          style={{ color: colorVar }}
        />
        {/* Intensified glow on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `
              0 0 15px ${colorVar},
              0 0 30px ${colorVar},
              0 0 45px ${colorVar}60
            `,
          }}
        />
      </div>

      {/* Label */}
      <span
        className="text-sm font-medium transition-all duration-300 group-hover:text-white"
        style={{ color: "rgba(255, 255, 255, 0.7)" }}
      >
        {label}
      </span>
    </motion.a>
  );
}

function Contact() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const currentYear = new Date().getFullYear();

  return (
    <footer
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
        <motion.div variants={itemVariants} className="text-center mb-12">
          <GlitchWrapper intensity="subtle" trigger="random" delayVariant={5}>
            <NeonText
              as="h2"
              color="red"
              intensity="normal"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase"
            >
              Let&apos;s Connect
            </NeonText>
          </GlitchWrapper>
        </motion.div>

        {/* Contact Links */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 mb-16"
        >
          {contactLinks.map((link) => (
            <ContactLink
              key={link.id}
              icon={link.icon}
              label={link.label}
              href={link.href}
              color={link.color as NeonColor}
            />
          ))}
        </motion.div>

        {/* Footer Copyright */}
        <motion.div
          variants={itemVariants}
          className="text-center pt-8 border-t"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <p
            className="text-sm"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            &copy; {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <p
            className="text-xs mt-2"
            style={{ color: "rgba(255, 255, 255, 0.3)" }}
          >
            Built with Next.js, TypeScript, and a lot of neon.
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255, 255, 255, 0.2)" }}
          >
            Shipped faster with Ralph Wiggums Loop
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export { Contact };
