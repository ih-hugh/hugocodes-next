"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { NeonText } from "@/components/ui/neon-text";
import { TypingEffect } from "@/components/ui/typing-effect";
import { ScanLines } from "@/components/ui/scan-lines";
import { GlitchWrapper, GlitchText } from "@/components/ui/glitch-wrapper";
import { personalInfo } from "@/lib/resume-data";

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
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
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const, // easeOut cubic bezier
    },
  },
} as const;

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const, // easeOut cubic bezier
      delay: 1.5,
    },
  },
} as const;

const scrollIndicatorVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 2,
      duration: 0.5,
    },
  },
} as const;

function Hero() {
  const [showTypingEffect, setShowTypingEffect] = React.useState(false);
  const [isInitialGlitching, setIsInitialGlitching] = React.useState(false);

  // Delay typing effect to start after name animation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypingEffect(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Trigger intense glitch effect on mount (same as hover effect)
  React.useEffect(() => {
    // Small delay to let the page render first
    const startTimer = setTimeout(() => {
      setIsInitialGlitching(true);
    }, 300);

    // Stop the glitch after 0.5s (same duration as hover)
    const stopTimer = setTimeout(() => {
      setIsInitialGlitching(false);
    }, 800);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--cyber-dark)" }}
    >
      {/* CRT Scan Lines Overlay */}
      <ScanLines opacity={0.03} />

      {/* Main Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Name - Large Neon Cyan Text with Glitch on Load + Hover */}
        <motion.div variants={itemVariants}>
          <div
            className="relative glitch-on-hover"
            style={isInitialGlitching ? {
              animation: "glitch-intense 0.5s ease-in-out"
            } : undefined}
          >
            <NeonText
              as="h1"
              color="cyan"
              intensity="intense"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight uppercase"
            >
              {personalInfo.name}
            </NeonText>
          </div>
        </motion.div>

        {/* Title with Typing Effect */}
        <motion.div
          variants={itemVariants}
          className="mt-6 md:mt-8 text-xl sm:text-2xl md:text-3xl text-gray-300"
        >
          {showTypingEffect && (
            <TypingEffect
              text={personalInfo.title}
              speed={60}
              showCursor={true}
              cursor="_"
              className="font-mono"
            />
          )}
        </motion.div>

        {/* Experience Badge */}
        <motion.div
          variants={badgeVariants}
          className="mt-10 md:mt-14"
        >
          <GlitchWrapper intensity="subtle" trigger="hover">
            <div
              className="relative inline-block px-6 py-3 rounded-lg glitch-on-hover"
              style={{
                background: "rgba(10, 10, 15, 0.8)",
                border: "2px solid var(--neon-electric)",
                boxShadow: `
                  0 0 10px var(--neon-electric),
                  0 0 20px rgba(100, 150, 255, 0.3),
                  inset 0 0 10px rgba(100, 150, 255, 0.1)
                `,
              }}
            >
              <span
                className="text-sm sm:text-base md:text-lg font-semibold tracking-wide"
                style={{ color: "var(--neon-electric)" }}
              >
                {personalInfo.yearsExperience} Years Experience
              </span>
            </div>
          </GlitchWrapper>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Positioned at bottom of viewport */}
      <motion.div
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{
            y: [0, 12, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--neon-cyan)", opacity: 0.7 }}
          >
            Scroll
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--neon-cyan)" }}
          >
            <path d="M12 5v14" />
            <path d="M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Background gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, var(--cyber-dark) 70%)`,
        }}
      />
    </section>
  );
}

export { Hero };
