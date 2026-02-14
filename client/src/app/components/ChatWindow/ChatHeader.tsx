import React, { memo } from "react";
import Link from "next/link";

interface ChatHeaderProps {
    roomId: string;
    onAudioCall: () => void;
    onVideoCall: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomId, onAudioCall, onVideoCall }) => {
    return (
        <div className="px-6 py-5 bg-[#0f1115] border-b border-[#2d3139] flex justify-between items-center z-10 backdrop-blur-xl bg-opacity-90">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
                    #
                </div>
                <div>
                    <h2 className="font-black text-slate-100 leading-tight tracking-tight uppercase text-sm">Synchronized Room</h2>
                    <p className="text-[10px] text-slate-500 font-bold font-mono tracking-widest">{roomId}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onAudioCall}
                    className="p-3 rounded-2xl bg-[#1a1d23] hover:bg-[#2d3139] text-slate-400 hover:text-indigo-400 transition-all duration-300 active:scale-90 border border-[#2d3139]"
                    title="Secure Voice Call"
                >
                    <span className="text-xl">📞</span>
                </button>
                <button
                    onClick={onVideoCall}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/40 transition-all duration-300 active:scale-95 border border-indigo-500/20 group"
                >
                    <span className="text-xl group-hover:animate-pulse">📹</span>
                    <span className="font-black text-xs uppercase tracking-widest">Call</span>
                </button>
                <div className="w-px h-8 bg-[#2d3139] mx-2" />
                <Link href="/chat">
                    <span className="p-3 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer border border-transparent hover:border-red-500/20">
                        ✖
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default memo(ChatHeader);
