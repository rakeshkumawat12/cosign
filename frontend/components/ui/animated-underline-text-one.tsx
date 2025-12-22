"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  underlineColor?: string;
}

export function AnimatedText({
  text,
  className = "",
  delay = 0,
  underlineColor = "from-cyan-500 to-purple-600",
}: AnimatedTextProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r ${underlineColor}`}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          duration: 0.8,
          delay: delay,
          ease: "easeInOut",
        }}
      />
    </span>
  );
}
