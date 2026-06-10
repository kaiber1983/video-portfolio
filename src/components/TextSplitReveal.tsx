"use client";

import { useRef } from "react";
import { useInView, motion } from "framer-motion";

type TextSplitRevealProps = {
  text: string;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
};

export default function TextSplitReveal({
  text,
  className = "",
  staggerDelay = 0.04,
  delay = 0,
  as: Tag = "p",
}: TextSplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  const words = text.split(" ");

  if (words.length === 0) return null;

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + index * staggerDelay,
          }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </Tag>
  );
}
