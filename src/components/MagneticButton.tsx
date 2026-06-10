"use client";

import { useRef } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  strength?: number;
} & Record<string, unknown>;

export default function MagneticButton({
  children,
  className = "",
  href,
  strength = 0.3,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 12, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 200, damping: 12, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (href) {
    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        <motion.a
          href={href}
          style={{ x: springX, y: springY }}
          className={className}
          {...props}
        >
          {children}
        </motion.a>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.button
        style={{ x: springX, y: springY }}
        className={className}
        type="button"
        {...props}
      >
        {children}
      </motion.button>
    </div>
  );
}
