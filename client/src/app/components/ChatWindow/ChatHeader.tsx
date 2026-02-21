import React, { memo } from "react";
import Link from "next/link";

interface ChatHeaderProps {
    roomId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomId }) => {
    return (
        <div className="px-4 sm:px-6 py-4 bg-background border-b border-border flex justify-between items-center z-10 sticky top-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                    #
                </div>
                <div className="min-w-0">
                    <h2 className="font-semibold text-foreground text-sm truncate">Channel</h2>
                    <p className="text-[11px] text-[#6e6e6a] truncate">{roomId}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Link href="/chat">
                    <span className="p-2 rounded-lg text-[#6e6e6a] hover:bg-[#f3f3f2] transition-all cursor-pointer border border-transparent hover:border-border">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default memo(ChatHeader);
