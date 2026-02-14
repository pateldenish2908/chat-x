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
        <div className="p-6 bg-[#0f1115] border-t border-[#2d3139]">
            <div className="max-w-5xl mx-auto flex items-center gap-4 bg-[#1a1d23] p-2 rounded-[2rem] border border-[#2d3139] group focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-500 shadow-inner">
                <input
                    className="flex-1 bg-transparent px-6 py-3 focus:outline-none text-slate-100 placeholder-slate-600 text-sm font-medium"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type an encrypted message..."
                />
                <button
                    className={`p-4 rounded-[1.5rem] transition-all duration-500 flex items-center justify-center ${input.trim()
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 transform scale-100"
                        : "bg-[#0f1115] text-slate-700 cursor-not-allowed scale-95"
                        }`}
                    onClick={handleSend}
                    disabled={!input.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default memo(ChatInput);
