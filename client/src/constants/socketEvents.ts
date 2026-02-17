export enum SocketEvents {
    CONNECTION = 'connection',
    DISCONNECT = 'disconnect',
    JOIN = 'join', // Keeping for room compatibility if needed, though backend uses direct
    LEAVE = 'leave',
    SEND_MESSAGE = 'send_message',
    RECEIVE_MESSAGE = 'receive_message',
    MESSAGE_SENT = 'message_sent',
    MESSAGE_DELIVERED = 'message_delivered',
    MESSAGE_READ = 'message_read',
    TYPING_START = 'typing_start',
    TYPING_STOP = 'typing_stop',
    TYPING_STARTED = 'typing-started', // Old compatibility mapping if needed
    TYPING_STOPPED = 'typing-stopped',
    USER_ONLINE = 'user_online',
    USER_OFFLINE = 'user_offline',
    AUTHENTICATE = 'authenticate',
    CHAT_LIST_UPDATED = 'chat_list_updated',
}
