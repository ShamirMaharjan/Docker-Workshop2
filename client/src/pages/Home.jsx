import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Cpu, ShieldCheck } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* HERO SECTION - THE COMMAND CENTER */}
            <header className="relative h-[90vh] flex flex-col items-center justify-center p-6 hero-bg">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center z-10"
                >
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30 text-xs font-bold uppercase tracking-widest shadow-lg">
                        V1.0 - Production Ready
                    </div>
                    <h1 className="text-6xl sm:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
                        Your Pipeline,<br/> <span className="text-blue-400">Mastered.</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-xl mx-auto mb-10">
                        Stop juggling tabs. Start focusing on the work that actually defines your progress. Built by Thaveesha Vithana to keep you in the zone.
                    </p>
                    <Link to="/auth">
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-5 rounded-2xl text-lg shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all flex items-center gap-3 mx-auto group">
                            Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </motion.div>
            </header>

            {/* THE "WHY" SECTION - HUMAN CONNECTION */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black mb-4">Why I built this.</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        I got tired of task managers that felt like data entry jobs. I wanted something that felt like a flight deck—something that understood that **"how you feel"** is just as important as **"what you do."**
                    </p>
                </div>

                <div className="space-y-16">
                    <FeatureBlock 
                        icon={Activity} 
                        title="Focus Over Clutter"
                        text="Most apps want you to add more. Mine helps you clear the noise. We prioritize the 'Today' column, ensuring your mental bandwidth is spent on execution, not sorting."
                    />
                    <FeatureBlock 
                        icon={Cpu} 
                        title="An Agent That Cares"
                        text="You’ll meet your companion node—an emotion-aware assistant that senses when you're overloaded and nudges you to breathe, not just work."
                    />
                    <FeatureBlock 
                        icon={ShieldCheck} 
                        title="Private By Design"
                        text="No trackers. No bloat. Just your data, your tasks, and a secure environment. I treat your account security with the same priority as my own."
                    />
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 text-center bg-gray-50 border-t border-gray-100">
                <p className="text-gray-500 font-bold">Thaveesha Vithana</p>
                <a href="https://yourwebsite.com" className="text-blue-600 text-sm hover:underline">Portfolio / Website</a>
            </footer>
        </div>
    );
}

// Helper component for consistent "Human-y" feature blocks
function FeatureBlock({ icon: Icon, title, text }) {
    return (
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shrink-0">
                <Icon size={32} />
            </div>
            <div>
                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{text}</p>
            </div>
        </div>
    );
}