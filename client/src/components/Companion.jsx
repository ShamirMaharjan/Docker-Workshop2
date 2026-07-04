import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Companion({ tasks, size = 'large ' }) {
    const [mood, setMood] = useState('idle');

    useEffect(() => {
        if (!tasks || tasks.length === 0) {
            setMood('idle')
            return;
        }

        const activeCount = tasks.filter(t => t.status === 'active').length;
        const clearedCount = tasks.filter(t => t.status === 'cleared').length;

        const recentActivity = tasks.some(t => {
            const updatedTime = new Date(t.updatedAt).getTime();
            const now = new Date().getTime();
            return (now - updatedTime) < 120000 // 2 minutes
        });

        if (activeCount > 5) setMood('overloaded');
        else if (clearedCount > 0 && recentActivity) setMood('celebrating');
        else if (activeCount > 0) setMood('focused');
        else setMood('idle');
    }, [tasks]);

    // controls the color and the floating speed
    const chassisVariants = {
        idle: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }, fill: "#e2e8f0" },
        focused: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }, fill: "#bfdbfe" },
        celebrating: { y: [0, -20, 0], transition: { repeat: Infinity, duration: 1, ease: "easeInOut" }, fill: "#bbf7d0" },
        overloaded: { x: [-2, -2, -2], transition: { repeat: Infinity, duration: 0.2, }, fill: "#fecaca" },
    };

    const eyeVariants = {
        idle: { scaleY: [1, 1, 0.1, 1, 1], transition: { repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] } }, // blinking
        focused: { scaleY: 0.6, scaleX: 1.2, borderRadius: "20%" }, // squinting
        celebrating: { scaleY: 0.5, borderBottomLeftRadius: "50%", borderBottomRightRadius: "50%", borderTopLeftRadius: "0%", borderTopRightRadius: "0%" }, // upside down
        overload: { rotate: [0, 15, -15, 0], transition: { repeat: Infinity, duration: 0.5 } }, // shaking
    };

    const coreGlow = {
        idle: "drop-shadow(0 0 10px rgba(148,163,184,0.5))",
        focused: "drop-shadow(0 0 15px rgba(59,130,246,0.8))",
        celebrating: "drop-shadow(0 0 20px rgba(16,185,129,0.8))",
        overloaded: "drop-shadow(0 0 20px rgba(239,68,68,0.9))",
    };

    const scale = size === 'small' ? 0.5 : 1;

    return (
        <div className={`flex flex-col items-center justify-center ${size === 'small' ? 'h-16 w-16' : 'h-48 w-full'}`}>
            <motion.div
                style={{ filter: coreGlow[mood], scale }}
                className="relative flex items-center justify-center"
            >
                {/*the robot chassis*/}
                <motion.svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    variants={chassisVariants}
                    animate={mood}
                >
                    <rect x="15" y="15" width="70" height="70" rx="30" />
                    <rect x="25" y="30" width="50" height="40" rx="25" fill="#1e293b" />
                </motion.svg>

                {/*the eyes*/}
                <div className="absolute top-[38px] left-[32px] flex gap-3 z-10">
                    <motion.div
                        className={`w-4 h-6 bg-white rounded-full`}
                        variants={eyeVariants}
                        animate={mood}
                    />
                </div>
            </motion.div>

            {/*status text for desktop*/}
            {size === 'large' && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={mood}
                    className="mt-4 text-center"
                >
                    <p className="text-xs font-black uppercase tracking-wider text-gray-500">System: {mood}</p>
                </motion.div>
            )}
        </div>
    );
}