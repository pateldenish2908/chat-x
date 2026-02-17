import React, { memo } from "react";
import Link from "next/link";

interface ChatHeaderProps {
    roomId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomId }) => {
    return (
        <div className="px-3 sm:px-6 py-4 sm:py-5 bg-[#0f1115] border-b border-[#2d3139] flex justify-between items-center z-10 backdrop-blur-xl bg-opacity-90 transition-all">
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden max-w-[50%] xs:max-w-[60%] sm:max-w-none">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
                    #
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="font-black text-slate-100 leading-tight tracking-tight uppercase text-[10px] sm:text-xs truncate">Synchronized Room</h2>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold font-mono tracking-widest truncate">{roomId}</p>
                </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4 ml-2">
                <Link href="/chat">
                    <span className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer border border-transparent hover:border-red-500/20">
                        ✖
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default memo(ChatHeader);
