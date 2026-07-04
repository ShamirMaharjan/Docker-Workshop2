import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Companion({ tasks, size = 'large' }) {
    const [mood, setMood] = useState('idle');

    useEffect(() => {
        if (!tasks || tasks.length === 0) {
            setMood('idle');
            return;
        }

        const activeCount = tasks.filter(t => t.status === 'active').length;
        const clearedCount = tasks.filter(t => t.status === 'cleared').length;
        
        const recentActivity = tasks.some(t => {
            const updatedTime = new Date(t.updatedAt).getTime();
            const now = new Date().getTime();
            return (now - updatedTime) < 120000;
        });

        if (activeCount > 5) setMood('overloaded');
        else if (clearedCount > 0 && recentActivity) setMood('celebrating');
        else if (activeCount > 0) setMood('focused');
        else setMood('idle');
    }, [tasks]);

    // chassis, breathing and floating
    const chassisVariants = {
        idle: { y: [0, -8, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } },
        focused: { y: [0, -4, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
        celebrating: { y: [0, -25, 0], transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" } },
        overloaded: { x: [-3, 3, -3], y: [0, 2, 0], transition: { repeat: Infinity, duration: 0.1 } }
    };

    // antennas
    const leftAntennaVariants = {
        idle: { rotate: -15, transition: { type: "spring" } },
        focused: { rotate: -5, transition: { type: "spring" } },
        celebrating: { rotate: -35, transition: { type: "spring", bounce: 0.6 } },
        overloaded: { rotate: -60, transition: { type: "spring" } } // Droops down when stressed
    };

    const rightAntennaVariants = {
        idle: { rotate: 15, transition: { type: "spring" } },
        focused: { rotate: 5, transition: { type: "spring" } },
        celebrating: { rotate: 35, transition: { type: "spring", bounce: 0.6 } },
        overloaded: { rotate: 60, transition: { type: "spring" } }
    };

    // eyes
    const eyeColors = {
        idle: "#38bdf8", // Light Blue
        focused: "#818cf8", // Indigo
        celebrating: "#34d399", // Emerald
        overloaded: "#f87171" // Red
    };

    const leftEyeVariants = {
        idle: { scaleY: [1, 1, 0.1, 1, 1], scaleX: 1, rotate: 0, borderRadius: "50%", transition: { repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] } },
        focused: { scaleY: 0.5, scaleX: 1.2, rotate: 10, borderRadius: "20%" }, // Squinting inward
        celebrating: { scaleY: 0.6, scaleX: 1, rotate: 0, borderBottomLeftRadius: "100%", borderBottomRightRadius: "100%", borderTopLeftRadius: "10%", borderTopRightRadius: "10%" }, // Happy curve
        overloaded: { scaleY: 0.4, scaleX: 1.2, rotate: 20, borderRadius: "10%" } // Angry slant
    };

    const rightEyeVariants = {
        idle: { scaleY: [1, 1, 0.1, 1, 1], scaleX: 1, rotate: 0, borderRadius: "50%", transition: { repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] } },
        focused: { scaleY: 0.5, scaleX: 1.2, rotate: -10, borderRadius: "20%" },
        celebrating: { scaleY: 0.6, scaleX: 1, rotate: 0, borderBottomLeftRadius: "100%", borderBottomRightRadius: "100%", borderTopLeftRadius: "10%", borderTopRightRadius: "10%" },
        overloaded: { scaleY: 0.4, scaleX: 1.2, rotate: -20, borderRadius: "10%" }
    };

    // thruster exhaust
    const thrusterVariants = {
        idle: { scaleY: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5], transition: { repeat: Infinity, duration: 2 } },
        focused: { scaleY: [1, 1.5, 1], opacity: [0.7, 1, 0.7], transition: { repeat: Infinity, duration: 1 } },
        celebrating: { scaleY: [1.5, 2.5, 1.5], opacity: [0.8, 1, 0.8], transition: { repeat: Infinity, duration: 0.4 } },
        overloaded: { scaleY: [0.5, 0.8, 0.5], opacity: [0.3, 0.6, 0.3], transition: { repeat: Infinity, duration: 0.1 } } // Sputtering
    };

    const scale = size === 'small' ? 0.35 : 1;

    return (
        <div className={`flex flex-col items-center justify-center ${size === 'small' ? 'h-16 w-16' : 'h-48 w-full'}`}>
            <motion.div 
                style={{ scale }}
                className="relative flex flex-col items-center justify-center origin-center"
            >
                {/*floating rig*/}
                <motion.div 
                    variants={chassisVariants} 
                    animate={mood}
                    className="relative z-10 flex flex-col items-center"
                >
                    <motion.div 
                        variants={leftAntennaVariants} animate={mood}
                        className="absolute -left-6 top-6 w-8 h-3 bg-slate-300 rounded-l-full origin-right z-0"
                    />
                    
                    <motion.div 
                        variants={rightAntennaVariants} animate={mood}
                        className="absolute -right-6 top-6 w-8 h-3 bg-slate-300 rounded-r-full origin-left z-0"
                    />

                    {/*main chassis*/}
                    <div className="w-32 h-32 bg-gradient-to-b from-white to-slate-200 rounded-[2.5rem] shadow-xl border-4 border-slate-100 flex items-center justify-center relative z-10 overflow-hidden">
                        
                        {/*visor*/}
                        <div className="w-24 h-16 bg-slate-900 rounded-2xl shadow-inner border-b-2 border-slate-700 flex items-center justify-center gap-3 relative overflow-hidden">
                            
                            {/*visor glare effect*/}
                            <div className="absolute -top-10 -right-10 w-20 h-32 bg-white/10 rotate-45 pointer-events-none"></div>

                            <motion.div 
                                variants={leftEyeVariants} animate={mood}
                                style={{ backgroundColor: eyeColors[mood] }}
                                className="w-5 h-7 shadow-[0_0_15px_currentColor]"
                            />
                            
                            <motion.div 
                                variants={rightEyeVariants} animate={mood}
                                style={{ backgroundColor: eyeColors[mood] }}
                                className="w-5 h-7 shadow-[0_0_15px_currentColor]"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    variants={thrusterVariants} animate={mood}
                    style={{ backgroundColor: eyeColors[mood] }}
                    className="w-8 h-10 rounded-b-full blur-md opacity-60 absolute -bottom-6 z-0 origin-top"
                />
            </motion.div>

            {size === 'large' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={mood} className="mt-8 text-center z-20">
                    <p className="text-xs font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Status: {mood}
                    </p>
                </motion.div>
            )}
        </div>
    );
}