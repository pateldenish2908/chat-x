"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                <div className="w-32 h-32 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center text-6xl mb-8 mx-auto shadow-inner border border-red-500/20">
                    ⚠️
                </div>

                <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">
                    Connection Interrupted
                </h1>
                <h2 className="text-lg font-bold text-red-500/80 mb-6 uppercase tracking-[0.2em]">
                    Internal Protocol Error
                </h2>
                <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                    A critical exception has occurred within the secure node. The transmission was aborted to maintain integrity.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95"
                    >
                        Re-establish Link
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-8 py-4 bg-[#1a1d23] hover:bg-[#2d3139] text-slate-200 font-bold rounded-2xl transition-all duration-300 border border-[#2d3139] hover:scale-105 active:scale-95"
                    >
                        Abort and Recover
                    </button>
                </div>

                {error.digest && (
                    <p className="mt-12 text-[10px] text-slate-700 font-mono tracking-[0.2em] uppercase">
                        Error Signature: {error.digest}
                    </p>
                )}
            </motion.div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#2d3139 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
    );
}
