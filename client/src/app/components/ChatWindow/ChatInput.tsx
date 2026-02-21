import React, { useState, memo } from "react";

interface ChatInputProps {
    onSendMessage: (content: string) => void;
    onTyping: (isTyping: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onTyping }) => {
    const [input, setInput] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        onTyping(true);
    };

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input.trim());
        setInput("");
        onTyping(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-background border-t border-border">
            <div className="max-w-4xl mx-auto flex items-end gap-3 bg-surface p-2 rounded-2xl border border-border focus-within:border-[#cbcbcb] transition-colors shadow-sm">
                <input
                    className="flex-1 bg-transparent px-3 py-2.5 focus:outline-none text-foreground placeholder-[#a3a3a0] text-sm"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                />
                <button
                    className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${input.trim()
                        ? "bg-[#1d1d1b] text-white"
                        : "bg-[#f3f3f2] text-[#cbcbcb] cursor-not-allowed"
                        }`}
                    onClick={handleSend}
                    disabled={!input.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default memo(ChatInput);
