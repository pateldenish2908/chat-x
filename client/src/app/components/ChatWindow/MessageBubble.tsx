import React, { memo } from "react";
import { Message, User } from "@/types";

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group fade-in`}>
            <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                <div className={`px-6 py-4 rounded-[1.75rem] shadow-xl text-sm leading-relaxed ${isOwn
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-900/20"
                    : "bg-[#1a1d23] text-slate-200 rounded-tl-none border border-[#2d3139] shadow-black/20"
                    }`}>
                    <div className="whitespace-pre-wrap break-words font-medium">
                        {message?.message}
                    </div>
                </div>
                <span className="text-[10px] mt-2 text-slate-600 font-black uppercase tracking-widest px-2">
                    {message.createdAt && new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
};

export default memo(MessageBubble);
