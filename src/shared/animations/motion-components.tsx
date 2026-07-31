'use client';

import React from 'react';
import { motion, useReducedMotion, HTMLMotionProps } from 'motion/react';
import {
  fadeInUp,
  fadeIn,
  scaleIn,
  staggerContainer,
  staggerItem,
} from './variants';

export interface MotionWrapperProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className, ...props }: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, delay = 0, className, ...props }: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, className, ...props }: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerList({ children, className, ...props }: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...props }: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}
