import { Message } from "@/types";

const CHAT_STORAGE_KEY = "tinderx_chat_history";

export const saveMessage = (roomId: string, message: Message) => {
    const history = getChatHistory();
    if (!history[roomId]) {
        history[roomId] = [];
    }

    // Prevent duplicate messages if needed (by _id or temporary id)
    const exists = history[roomId].some(m => m.messageId === message.messageId);
    if (!exists) {
        history[roomId].push(message);
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history));
    }
};

export const updateMessageStatus = (roomId: string, messageId: string, status: "sent" | "delivered" | "read") => {
    const history = getChatHistory();
    if (history[roomId]) {
        const message = history[roomId].find(m => m.messageId === messageId);
        if (message) {
            message.status = status;
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history));
        }
    }
};

export const getMessages = (roomId: string): Message[] => {
    const history = getChatHistory();
    return history[roomId] || [];
};

const getChatHistory = (): Record<string, Message[]> => {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem(CHAT_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};
