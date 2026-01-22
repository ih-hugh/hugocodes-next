"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TypingEffectProps {
  /** The text to type out */
  text: string;
  /** Speed in milliseconds per character */
  speed?: number;
  /** Additional CSS classes */
  className?: string;
  /** Callback when typing completes */
  onComplete?: () => void;
  /** Whether to show the blinking cursor */
  showCursor?: boolean;
  /** Cursor character */
  cursor?: string;
  /** Delay before typing starts (in milliseconds) */
  startDelay?: number;
  /** Whether typing should start */
  enabled?: boolean;
}

function TypingEffect({
  text,
  speed = 50,
  className,
  onComplete,
  showCursor = true,
  cursor = "|",
  startDelay = 0,
  enabled = true,
}: TypingEffectProps) {
  const [displayedText, setDisplayedText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) {
      setDisplayedText("");
      setIsTyping(false);
      setIsComplete(false);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;

    const startTyping = () => {
      setIsTyping(true);
      setIsComplete(false);
      setDisplayedText("");

      const typeNextChar = () => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
          timeoutId = setTimeout(typeNextChar, speed);
        } else {
          setIsTyping(false);
          setIsComplete(true);
          onComplete?.();
        }
      };

      typeNextChar();
    };

    const delayTimeout = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, speed, startDelay, enabled, onComplete]);

  return (
    <span className={cn("inline", className)}>
      {displayedText}
      {showCursor && (
        <span
          className={cn(
            "inline-block ml-0.5",
            isTyping || !isComplete
              ? "animate-[typing-cursor_1s_step-end_infinite]"
              : "opacity-0"
          )}
          aria-hidden="true"
        >
          {cursor}
        </span>
      )}
    </span>
  );
}

// A hook version for more control
function useTypingEffect(
  text: string,
  options: {
    speed?: number;
    startDelay?: number;
    enabled?: boolean;
    onComplete?: () => void;
  } = {}
) {
  const { speed = 50, startDelay = 0, enabled = true, onComplete } = options;
  const [displayedText, setDisplayedText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) {
      setDisplayedText("");
      setIsTyping(false);
      setIsComplete(false);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;

    const startTyping = () => {
      setIsTyping(true);
      setIsComplete(false);
      setDisplayedText("");

      const typeNextChar = () => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
          timeoutId = setTimeout(typeNextChar, speed);
        } else {
          setIsTyping(false);
          setIsComplete(true);
          onComplete?.();
        }
      };

      typeNextChar();
    };

    const delayTimeout = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, speed, startDelay, enabled, onComplete]);

  return { displayedText, isTyping, isComplete };
}

export { TypingEffect, useTypingEffect, type TypingEffectProps };
