'use client';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import MagneticButton from '@/components/ui/magnetic-button';
import TextReveal from '@/components/ui/text-reveal';
import { motion } from 'framer-motion';
import { ArrowRight, Utensils, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
    isLoggedIn: boolean;
}

export function Hero({ isLoggedIn }: HeroProps) {
    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-900 dark:to-orange-950/20">
            {/* Animated Background Blobs */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-300/30 rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-3xl"
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            <div className="container px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="space-y-6 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                            <TextReveal text="Connect. Share." />
                            <span>
                                <TextReveal text="Eliminate Hunger." />
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
                            A smart platform bridging the gap between surplus food and those in need. Join our community to reduce waste and feed the hungry.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                        <Link href={isLoggedIn ? "/dashboard" : "/sign-up"}>
                            <MagneticButton>
                                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group">
                                    {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </MagneticButton>
                        </Link>
                        {!isLoggedIn && (
                            <Link href="/sign-in">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                </div>

                {/* 3D Visuals */}
                <div className="relative h-[400px] w-full flex items-center justify-center">
                    <motion.div
                        className="relative w-full max-w-md aspect-square"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Center Card */}
                        <GlassCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 flex flex-col items-center justify-center z-20 bg-white/60 dark:bg-black/60 backdrop-blur-md">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Heart className="w-24 h-24 text-red-500 fill-red-500 dropshadow-lg" />
                            </motion.div>
                            <h3 className="mt-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                                Annadaan
                            </h3>
                        </GlassCard>

                        {/* Floating Icons */}
                        <FloatingIcon icon={<Utensils className="w-8 h-8 text-orange-600" />} delay={0} x={-120} y={-80} />
                        <FloatingIcon icon={<Share2 className="w-8 h-8 text-blue-600" />} delay={1} x={120} y={-40} />
                        <FloatingIcon icon={<div className="text-2xl">🥗</div>} delay={2} x={-100} y={100} />
                        <FloatingIcon icon={<div className="text-2xl">🍞</div>} delay={1.5} x={100} y={80} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function FloatingIcon({ icon, delay, x, y }: { icon: React.ReactNode, delay: number, x: number, y: number }) {
    return (
        <motion.div
            className="absolute top-1/2 left-1/2 p-4 bg-white/80 dark:bg-black/80 backdrop-blur shadow-lg rounded-2xl border border-white/20"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
                x: [x, x + 10, x],
                y: [y, y - 10, y],
                opacity: 1
            }}
            transition={{
                duration: 3,
                delay: delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }}
        >
            {icon}
        </motion.div>
    );
}
