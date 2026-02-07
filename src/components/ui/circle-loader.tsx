'use client';

import { motion } from 'framer-motion';

export default function CircleLoader() {
    return (
        <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    className="w-4 h-4 bg-orange-500 rounded-full"
                    animate={{
                        y: [-10, 0, -10],
                        scale: [1, 0.8, 1],
                        opacity: [1, 0.5, 1],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
