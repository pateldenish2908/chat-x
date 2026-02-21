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
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group animate-in fade-in duration-300`}>
            <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${isOwn
                    ? "bg-[#f3f3f2] text-foreground border border-border"
                    : "bg-surface text-foreground border border-border"
                    }`}>
                    <div className="whitespace-pre-wrap break-words">
                        {message?.content}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 px-1">
                    <span className="text-[10px] text-[#a3a3a0] font-medium">
                        {message.createdAt && new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {renderStatus()}
                </div>
            </div>
        </div>
    );
};

export default memo(MessageBubble);
