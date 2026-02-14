const SocketEvents = require('../../constants/socketEvents');
const { sendMessage } = require('../../services/message.service');

module.exports = (io, socket) => {
    const joinRoom = ({ roomId }) => {
        socket.join(roomId);
        console.log(`User ${socket.data.userId} joined room ${roomId}`);
    };

    const leaveRoom = ({ roomId }) => {
        socket.leave(roomId);
        console.log(`User ${socket.data.userId} left room ${roomId}`);
    };

    const typing = ({ roomId, user }) => {
        socket.to(roomId).emit(SocketEvents.TYPING_STARTED, user);
    };

    const stopTyping = ({ roomId, user }) => {
        socket.to(roomId).emit(SocketEvents.TYPING_STOPPED, user);
    };

    const handleSendMessage = async (data) => {
        try {
            const { chatRoom, senderId, content } = data;

            // Validate participation in room? (Optional optimization)

            const message = await sendMessage(chatRoom, senderId, content);
            io.to(chatRoom).emit(SocketEvents.RECEIVE_MESSAGE, message);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('ERROR', { message: 'Failed to send message' });
        }
    };

    socket.on(SocketEvents.JOIN, joinRoom);
    socket.on(SocketEvents.LEAVE, leaveRoom);
    socket.on(SocketEvents.TYPING, typing);
    socket.on(SocketEvents.STOP_TYPING, stopTyping);
    socket.on(SocketEvents.SEND_MESSAGE, handleSendMessage);
};
