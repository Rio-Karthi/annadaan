'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Clock, Users, Gift, TrendingUp } from 'lucide-react';

const features = [
    {
        icon: <MapPin className="w-10 h-10 text-orange-500" />,
        title: "Live Tracking",
        description: "Real-time location sharing for seamless food pickups."
    },
    {
        icon: <ShieldCheck className="w-10 h-10 text-green-500" />,
        title: "Verified Users",
        description: "Safe and secure community with authenticated profiles."
    },
    {
        icon: <Clock className="w-10 h-10 text-blue-500" />,
        title: "Instant Alerts",
        description: "Get notified immediately when food is available near you."
    },
    {
        icon: <Users className="w-10 h-10 text-purple-500" />,
        title: "Community Driven",
        description: "Connect with local NGOs, volunteers, and donors."
    },
    {
        icon: <Gift className="w-10 h-10 text-red-500" />,
        title: "Easy Donations",
        description: "List surplus food in seconds and make a difference."
    },
    {
        icon: <TrendingUp className="w-10 h-10 text-indigo-500" />,
        title: "Impact Tracking",
        description: "Visualize your contributions and history over time."
    }
];

export function Features() {
    return (
        <section className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400"
                    >
                        Why Choose Annadaan?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        Built with advanced technology to ensure food reaches those who need it most, efficiently and safely.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <GlassCard hoverEffect className="p-8 h-full bg-white/40 dark:bg-black/40">
                                <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-2xl w-fit shadow-sm">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
