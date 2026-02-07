'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false }: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                "backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/20 shadow-xl rounded-2xl overflow-hidden",
                hoverEffect && "hover:bg-white/40 dark:hover:bg-black/40 transition-colors duration-300",
                className
            )}
            initial={hoverEffect ? { scale: 1 } : undefined}
            whileHover={hoverEffect ? { scale: 1.02, y: -5 } : undefined}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    );
}
