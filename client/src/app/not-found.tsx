"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
            >
                <div className="w-32 h-32 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center text-6xl mb-8 mx-auto shadow-inner border border-indigo-500/20">
                    📡
                </div>

                <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-slate-300 mb-6 uppercase tracking-[0.2em]">
                    Signal Lost
                </h2>
                <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                    The node you are trying to reach is not responding. The link may have been severed or moved to a more secure location.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-900/20 hover:scale-105 active:scale-95 group"
                >
                    <span className="mr-2">Return to Base</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </motion.div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#2d3139 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
    );
}
