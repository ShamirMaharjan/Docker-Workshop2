import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Lock, Bot } from 'lucide-react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Companion from '../components/Companion';

export default function Home() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [demoTasks, setDemoTasks] = useState([]);

    const simulateToday = () => setDemoTasks([{ status: 'active', updatedAt: Date.now() }]);
    const simulateOverload = () => setDemoTasks(Array(6).fill({ status: 'active', updatedAt: Date.now() }));
    const simulateCelebrate = () => setDemoTasks([{ status: 'cleared', updatedAt: Date.now() }]);
    const simulateReset = () => setDemoTasks([]);

    const screenshots = [
        "/img_1.png",
        "/img_2.png",
        "/img_3.png",
        "/img_4.png",
        "/img_5.png"
    ];

    // auto redirect users to dashboard if they already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

            {/* hero */}
            <header className="relative pt-12 pb-16 lg:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60 -z-10"></div>
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[800px] sm:h-[600px] bg-blue-400/10 rounded-full blur-[80px] sm:blur-[120px] -z-10 pointer-events-none"
                />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center sm:gap-12 gap-8 lg:gap-16">

                    {/* left */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white border border-gray-200 text-xs sm:text-sm font-bold text-gray-600 shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            A smarter way to organize your day
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight leading-[1.1]">
                            Get things done, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">without the burnout.</span>
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Meet your new intelligent workspace. It tracks your tasks, senses when you're overwhelmed, and helps you focus on what actually matters today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link to="/auth">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3.5 sm:py-4 rounded-2xl text-base sm:text-lg shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] transition-all flex items-center gap-3 group cursor-pointer w-full sm:w-auto justify-center">
                                    Start for free <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* right */}
                    <div className="flex-1 relative w-full max-w-md lg:max-w-none flex flex-col items-center lg:items-end">
                        <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] shadow-2xl w-full max-w-sm relative">
                            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg rotate-12">
                                Try me!
                            </div>

                            <Companion tasks={demoTasks} size="large" />

                            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2">
                                <button onClick={simulateToday} className="py-2 px-3 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 text-xs sm:text-sm font-bold rounded-xl transition-colors border border-gray-100">
                                    Add Task
                                </button>
                                <button onClick={simulateCelebrate} className="py-2 px-3 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-600 text-xs sm:text-sm font-bold rounded-xl transition-colors border border-gray-100">
                                    Finish Task
                                </button>
                                <button onClick={simulateOverload} className="col-span-2 py-2 px-3 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs sm:text-sm font-bold rounded-xl transition-colors border border-gray-100">
                                    Add 6 Tasks at Once!
                                </button>
                                <button onClick={simulateReset} className="col-span-2 text-xs text-gray-400 hover:text-gray-600 font-bold mt-1 underline">
                                    Reset Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* infinity scroll */}
            <section className="py-12 bg-gray-50 border-y border-gray-200 overflow-hidden relative flex items-center">
                {/* fade edges */}
                <div className="absolute left-0 top-0 w-12 sm:w-24 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 w-12 sm:w-24 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

                <div className="flex gap-4 sm:gap-6 animate-[marquee_20s_linear_infinite] whitespace-nowrap px-4 sm:px-6 hover:[animation-play-state:paused]">
                    {/* original set */}
                    {screenshots.map((src, idx) => (
                        <div key={idx} className="w-[280px] h-[180px] sm:w-[400px] sm:h-[250px] shrink-0 border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-gray-200">
                            <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    {/* duplicate set for loop */}
                    {screenshots.map((src, idx) => (
                        <div key={idx + 'dup'} className="w-[280px] h-[180px] sm:w-[400px] sm:h-[250px] shrink-0 border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-gray-200">
                            <img src={src} alt={`Screenshot ${idx + 1} duplicate`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <style>{`
                    @keyframes marquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }
                `}</style>
            </section>

            {/* bento box */}
            <section className="py-20 sm:py-24 px-6 max-w-6xl mx-auto overflow-hidden">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Engineered for focus.</h2>
                </div>

                {/* bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="md:col-span-2 bg-slate-900 rounded-[2rem] p-6 sm:p-12 overflow-hidden relative group">
                        <div className="relative z-10">
                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4">Later, Today, Done.</h3>
                            <p className="text-slate-400 text-base sm:text-lg max-w-md">No messy folders. Just drag your tasks into the 'Today' column and execute. The interface gets out of your way.</p>
                        </div>
                        <div className="hidden sm:flex absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-slate-800 rounded-3xl border border-slate-700 flex-col gap-4 p-6 rotate-12 group-hover:rotate-6 group-hover:-translate-y-4 transition-all duration-500">
                            <div className="w-full h-8 bg-blue-500 rounded-lg"></div>
                            <div className="w-3/4 h-8 bg-slate-700 rounded-lg"></div>
                            <div className="w-5/6 h-8 bg-slate-700 rounded-lg"></div>
                        </div>
                    </div>

                    <div className="md:col-span-1 bg-blue-50 rounded-[2rem] p-6 sm:p-10 flex flex-col justify-center hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 mb-4 sm:mb-6">
                            <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 sm:mb-3">Locked Down.</h3>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">Enterprise-grade encryption, JWT sessions, and Cloudflare protection.</p>
                    </div>

                    <div className="md:col-span-1 bg-green-50 rounded-[2rem] p-6 sm:p-10 flex flex-col justify-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-500 mb-4 sm:mb-6">
                            <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 sm:mb-3">AI Companion.</h3>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">A reactive companion that warns you when your active pipeline is overloaded.</p>
                    </div>

                    <div className="md:col-span-2 bg-gray-100 rounded-[2rem] p-6 sm:p-12 flex flex-col justify-center">
                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4">Built on the MERN Stack.</h3>
                        <p className="text-sm sm:text-lg text-gray-600 max-w-lg mb-6 sm:mb-8 font-medium">Fully custom backend API architecture with MongoDB, Express, and Node.js. Lightning-fast frontend powered by React and Tailwind.</p>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {['MongoDB', 'Express', 'React', 'Node.js'].map(tech => (
                                <span key={tech} className="bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-700 shadow-sm border border-gray-100">{tech}</span>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* footer */}
            <footer className="bg-slate-900 border-t border-slate-800">
                <div className="py-12 sm:py-16 px-6 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                    
                <h2 className="text-3xl sm:text-4xl font-black mb-6 relative z-10">
                    Ready to clear your mind?
                </h2>
                    <Link to="/auth" className="relative z-10 w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-500 font-black px-8 py-3.5 rounded-2xl text-base sm:text-lg transition-colors shadow-lg shadow-blue-600/20 cursor-pointer">
                            Enter Workspace
                        </button>
                    </Link>
                </div>

                <div className="border-t border-slate-800/50 py-6 px-6">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs sm:text-sm font-medium text-center sm:text-left">
                        <p>© {new Date().getFullYear()} Thaveesha Vithana. Built In Sri Lanka.</p>
                        <div className="flex gap-6 justify-center">
                            <a href="https://tsvithana.vercel.app" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Portfolio</a>
                            <a href="https://github.com/Thaveesha-Sathsara" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}