import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// standard visuals
const CompanionCore = ({ mood, size, isFlipping, showConfetti }) => {
    const chassisVariants = {
        idle: { y: [0, -8, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } },
        focused: { y: [0, -4, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
        celebrating: { y: [0, -25, 0], transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" } },
        overloaded: { x: [-3, 3, -3], y: [0, 2, 0], transition: { repeat: Infinity, duration: 0.1 } }
    };

    const leftAntennaVariants = {
        idle: { rotate: -15, transition: { type: "spring" } },
        focused: { rotate: -5, transition: { type: "spring" } },
        celebrating: { rotate: -35, transition: { type: "spring", bounce: 0.6 } },
        overloaded: { rotate: -70, transition: { type: "spring" } } 
    };

    const rightAntennaVariants = {
        idle: { rotate: 15, transition: { type: "spring" } },
        focused: { rotate: 5, transition: { type: "spring" } },
        celebrating: { rotate: 35, transition: { type: "spring", bounce: 0.6 } },
        overloaded: { rotate: 70, transition: { type: "spring" } }
    };

    const eyeColors = {
        idle: "#38bdf8", focused: "#818cf8", celebrating: "#34d399", overloaded: "#f87171"
    };

    const leftEyeVariants = {
        idle: { scaleY: [1, 1, 0.1, 1, 1], scaleX: 1, rotate: 0, borderRadius: "50%", transition: { repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] } },
        focused: { scaleY: 0.5, scaleX: 1.2, rotate: 10, borderRadius: "20%" },
        celebrating: { scaleY: 0.6, scaleX: 1, rotate: 0, borderBottomLeftRadius: "100%", borderBottomRightRadius: "100%", borderTopLeftRadius: "10%", borderTopRightRadius: "10%" }, 
        overloaded: { scaleY: 0.4, scaleX: 1.2, rotate: 25, borderRadius: "10%" } 
    };

    const rightEyeVariants = {
        idle: { scaleY: [1, 1, 0.1, 1, 1], scaleX: 1, rotate: 0, borderRadius: "50%", transition: { repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] } },
        focused: { scaleY: 0.5, scaleX: 1.2, rotate: -10, borderRadius: "20%" },
        celebrating: { scaleY: 0.6, scaleX: 1, rotate: 0, borderBottomLeftRadius: "100%", borderBottomRightRadius: "100%", borderTopLeftRadius: "10%", borderTopRightRadius: "10%" },
        overloaded: { scaleY: 0.4, scaleX: 1.2, rotate: -25, borderRadius: "10%" }
    };

    const thrusterVariants = {
        idle: { scaleY: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5], transition: { repeat: Infinity, duration: 2 } },
        focused: { scaleY: [1, 1.5, 1], opacity: [0.7, 1, 0.7], transition: { repeat: Infinity, duration: 1 } },
        celebrating: { scaleY: [1.5, 2.5, 1.5], opacity: [0.8, 1, 0.8], transition: { repeat: Infinity, duration: 0.4 } },
        overloaded: { scaleY: [0.5, 0.8, 0.5], opacity: [0.3, 0.6, 0.3], transition: { repeat: Infinity, duration: 0.1 } } 
    };

    const scale = size === 'small' ? 0.35 : 1;

    return (
        <motion.div 
            style={{ scale }}
            animate={isFlipping ? { rotateY: [0, 360] } : { rotateY: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="relative flex flex-col items-center justify-center origin-center"
        >
            {/*confetti*/}
            {showConfetti && (
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                    {[...Array(16)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                            animate={{
                                x: (Math.random() - 0.5) * 300,
                                y: (Math.random() - 0.5) * 300,
                                scale: Math.random() * 1.5 + 0.5,
                                opacity: 0,
                                rotate: Math.random() * 360
                            }}
                            transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
                            className="absolute w-4 h-4 rounded-sm"
                            style={{ backgroundColor: ['#34d399', '#38bdf8', '#fbbf24', '#f87171'][i % 4] }}
                        />
                    ))}
                </div>
            )}

            <motion.div variants={chassisVariants} animate={mood} className="relative z-10 flex flex-col items-center">
                <motion.div variants={leftAntennaVariants} animate={mood} className="absolute -left-6 top-6 w-8 h-3 bg-slate-300 rounded-l-full origin-right z-0" />
                <motion.div variants={rightAntennaVariants} animate={mood} className="absolute -right-6 top-6 w-8 h-3 bg-slate-300 rounded-r-full origin-left z-0" />

                <div className="w-32 h-32 bg-gradient-to-b from-white to-slate-200 rounded-[2.5rem] shadow-xl border-4 border-slate-100 flex items-center justify-center relative z-10 overflow-hidden">
                    <div className="w-24 h-16 bg-slate-900 rounded-2xl shadow-inner border-b-2 border-slate-700 flex items-center justify-center gap-3 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-20 h-32 bg-white/10 rotate-45 pointer-events-none"></div>
                        <motion.div variants={leftEyeVariants} animate={mood} style={{ backgroundColor: eyeColors[mood] }} className="w-5 h-7 shadow-[0_0_15px_currentColor]" />
                        <motion.div variants={rightEyeVariants} animate={mood} style={{ backgroundColor: eyeColors[mood] }} className="w-5 h-7 shadow-[0_0_15px_currentColor]" />
                    </div>
                </div>
            </motion.div>

            <motion.div variants={thrusterVariants} animate={mood} style={{ backgroundColor: eyeColors[mood] }} className="w-8 h-10 rounded-b-full blur-md opacity-60 absolute -bottom-6 z-0 origin-top" />
        </motion.div>
    );
};

export default function Companion({ tasks, size = 'large' }) {
    const [mood, setMood] = useState('idle');
    const [isYelling, setIsYelling] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // refs to track previous state for edge detection
    const prevActiveRef = useRef(0);
    const prevClearedRef = useRef(0);

    useEffect(() => {
        if (!tasks) return;

        const activeCount = tasks.filter(t => t.status === 'active').length;
        const clearedCount = tasks.filter(t => t.status === 'cleared').length;
        
        // check for overload threshold
        if (activeCount > 5 && prevActiveRef.current <= 5) {
            setIsYelling(true);
            setTimeout(() => setIsYelling(false), 4000); // Take over screen for 4 seconds
        }

        // check for tasks cleared
        if (clearedCount > prevClearedRef.current) {
            setIsFlipping(true);
            setShowConfetti(true);
            setTimeout(() => setIsFlipping(false), 8000);
            setTimeout(() => setShowConfetti(false), 2000);
        }

        // set the continuous mood
        if (activeCount > 5) setMood('overloaded');
        else if (activeCount > 0) setMood('focused');
        else setMood('idle');

        // check if celebrating overrides standard mood
        if (clearedCount > prevClearedRef.current) {
            setMood('celebrating');
            setTimeout(() => {
                if (activeCount > 5) setMood('overloaded');
                else if (activeCount > 0) setMood('focused');
                else setMood('idle');
            }, 2000);
        }

        // update refs
        prevActiveRef.current = activeCount;
        prevClearedRef.current = clearedCount;
    }, [tasks]);

    return (
        <>
            {/*the standard docked companion*/}
            <div className={`flex flex-col items-center justify-center ${size === 'small' ? 'h-16 w-16' : 'h-48 w-full'} ${isYelling && size === 'small' ? 'opacity-0' : 'opacity-100'}`}>
                <CompanionCore mood={mood} size={size} isFlipping={isFlipping} showConfetti={showConfetti} />
                
                {size === 'large' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={mood} className="mt-8 text-center z-20">
                        <p className="text-xs font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Status: {mood}
                        </p>
                    </motion.div>
                )}
            </div>

            {/*screen overlay companion*/}
            <AnimatePresence>
                {isYelling && size === 'small' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.5, y: 100 }}
                            animate={{ scale: 1, y: 0, transition: { type: "spring", bounce: 0.6 } }}
                            exit={{ scale: 0.5, y: -100, opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            {/*yelling speech bubble*/}
                            <div className="bg-red-500 text-white font-black px-6 py-4 rounded-3xl text-lg sm:text-xl md:text-2xl mb-8 relative shadow-2xl text-center max-w-lg animate-bounce">
                                "CRITICAL OVERLOAD! YOU HAVE MORE THAN 5 ACTIVE TASKS. CLEAR THE TASKS IMMEDIATELY!"
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-red-500"></div>
                            </div>
                            
                            {/*render larger version to the screen*/}
                            <CompanionCore mood="overloaded" size="large" isFlipping={false} showConfetti={false} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}