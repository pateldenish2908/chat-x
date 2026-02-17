const SocketEvents = Object.freeze({
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    JOIN: 'join',
    LEAVE: 'leave',
    SEND_MESSAGE: 'send_message',
    RECEIVE_MESSAGE: 'receive_message',
    MESSAGE_SENT: 'message_sent',
    MESSAGE_DELIVERED: 'message_delivered',
    MESSAGE_READ: 'message_read',
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop',
    TYPING_STARTED: 'typing-started',
    TYPING_STOPPED: 'typing-stopped',
    USER_ONLINE: 'user_online',
    USER_OFFLINE: 'user_offline',
    AUTHENTICATE: 'authenticate',
});

module.exports = SocketEvents;
