const SocketEvents = require('../../constants/socketEvents');
const redisClient = require('../../config/redis');
const Message = require('../../models/message.model');

module.exports = (io, socket) => {
    const handleSendMessage = async (data) => {
        try {
            const { messageId, receiverId, content } = data;
            const senderId = socket.data.userId;

            if (!receiverId || !content || !messageId) {
                return socket.emit('ERROR', { message: 'Incomplete message data' });
            }

            // 1. Save to MongoDB
            const newMessage = new Message({
                messageId,
                chatRoom: [senderId, receiverId].sort().join('_'),
                sender: senderId,
                receiver: receiverId,
                content,
                status: 'sent'
            });
            await newMessage.save();

            // 2. Emit single tick (sent) back to sender
            socket.emit(SocketEvents.MESSAGE_SENT, { messageId, status: 'sent' });

            // 3. Store metadata in Redis with 24h TTL (optional)
            if (redisClient.isReady) {
                const messageKey = `message:${messageId}`;
                await redisClient.hset(messageKey, {
                    senderId,
                    receiverId,
                    status: 'sent',
                });
                await redisClient.expire(messageKey, 24 * 3600);
            }

            // 4. Find receiver and deliver
            // We use room-based emission (each user joins their own room named after their userId)
            // This is more reliable than tracking socketId in Redis
            io.to(receiverId).emit(SocketEvents.RECEIVE_MESSAGE, {
                messageId,
                senderId,
                receiverId,
                content,
                createdAt: newMessage.createdAt,
                status: 'sent'
            });

            // 5. Update status to delivered
            await Message.updateOne({ messageId }, { status: 'delivered' });
            socket.emit(SocketEvents.MESSAGE_DELIVERED, { messageId, status: 'delivered' });

            if (redisClient.isReady) {
                await redisClient.hset(`message:${messageId}`, 'status', 'delivered');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('ERROR', { message: 'Failed to send message' });
        }
    };

    const handleMessageRead = async (data) => {
        try {
            const { messageId, senderId } = data;

            // Update MongoDB
            await Message.updateOne({ messageId }, { status: 'read' });

            // Update Redis
            if (redisClient.isReady) {
                const messageKey = `message:${messageId}`;
                await redisClient.hset(messageKey, 'status', 'read');
            }

            io.to(senderId).emit(SocketEvents.MESSAGE_READ, { messageId, status: 'read' });
        } catch (err) {
            console.error('Message read update error:', err);
        }
    };

    const handleTypingStart = async (data) => {
        const { receiverId } = data;
        io.to(receiverId).emit(SocketEvents.TYPING_STARTED, { senderId: socket.data.userId });
    };

    const handleTypingStop = async (data) => {
        const { receiverId } = data;
        io.to(receiverId).emit(SocketEvents.TYPING_STOPPED, { senderId: socket.data.userId });
    };

    socket.on(SocketEvents.SEND_MESSAGE, handleSendMessage);
    socket.on(SocketEvents.MESSAGE_READ, handleMessageRead);
    socket.on(SocketEvents.TYPING_START, handleTypingStart);
    socket.on(SocketEvents.TYPING_STOP, handleTypingStop);
};
