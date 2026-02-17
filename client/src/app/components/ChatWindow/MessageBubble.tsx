import React, { memo } from "react";
import { Message } from "@/types";

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
    const renderStatus = () => {
        if (!isOwn) return null;
        switch (message.status) {
            case 'sent': return <span className="ml-1 opacity-50 text-[8px]">✓</span>;
            case 'delivered': return <span className="ml-1 opacity-70 text-[8px]">✓✓</span>;
            case 'read': return <span className="ml-1 text-indigo-400 text-[8px]">✓✓</span>;
            default: return null;
        }
    };

    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group fade-in`}>
            <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                <div className={`px-6 py-4 rounded-[1.75rem] shadow-xl text-sm leading-relaxed ${isOwn
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-900/20"
                    : "bg-[#1a1d23] text-slate-200 rounded-tl-none border border-[#2d3139] shadow-black/20"
                    }`}>
                    <div className="whitespace-pre-wrap break-words font-medium">
                        {message?.content}
                    </div>
                </div>
                <div className="flex items-center gap-1 mt-2 px-2">
                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                        {message.createdAt && new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {renderStatus()}
                </div>
            </div>
        </div>
    );
};

export default memo(MessageBubble);
