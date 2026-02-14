const SocketEvents = Object.freeze({
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    JOIN: 'join',
    LEAVE: 'leave',
    SEND_MESSAGE: 'sendMessage',
    RECEIVE_MESSAGE: 'receiveMessage',
    TYPING: 'typing',
    STOP_TYPING: 'stop-typing',
    TYPING_STARTED: 'typing-started',
    TYPING_STOPPED: 'typing-stopped',
    CALL_USER: 'call-user',
    CALL_MADE: 'call-made',
    MAKE_ANSWER: 'make-answer',
    ANSWER_MADE: 'answer-made',
    ICE_CANDIDATE: 'ice-candidate',
    END_CALL: 'end-call',
    CHAT_LIST_UPDATED: 'chatListUpdated',
});

module.exports = SocketEvents;
