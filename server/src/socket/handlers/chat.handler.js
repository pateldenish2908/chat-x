const SocketEvents = require('../../constants/socketEvents');
const redisClient = require('../../config/redis');
const Message = require('../../models/message.model');

module.exports = (io, socket) => {
    const handleSendMessage = async (data) => {
        try {
            const { messageId, roomId, content } = data;
            const senderId = socket.data.userId;
            console.log(`📩 Received SEND_MESSAGE: room=${roomId}, sender=${senderId}, content=${content}`);

            if (!roomId || !content || !messageId) {
                console.error('❌ Incomplete message data');
                return socket.emit('ERROR', { message: 'Incomplete message data' });
            }

            // 1. Get Room to find receiver
            const ChatRoom = require('../../models/chatRoom.model');
            const room = await ChatRoom.findById(roomId);
            if (!room) {
                console.error(`❌ Chat room not found: ${roomId}`);
                return socket.emit('ERROR', { message: 'Chat room not found' });
            }

            const receiverId = room.participants.find(p => p.toString() !== senderId.toString());
            console.log(`👤 Found receiver: ${receiverId}`);

            // 2. Save to MongoDB
            const newMessage = new Message({
                messageId,
                chatRoom: roomId,
                sender: senderId,
                receiver: receiverId,
                content,
                status: 'sent'
            });
            console.log('💾 Saving message to DB...');
            await newMessage.save();
            console.log('✅ Message saved');

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
            console.log(`📡 Emitting to room: ${receiverId.toString()}`);
            io.to(receiverId.toString()).emit(SocketEvents.RECEIVE_MESSAGE, {
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

            // 6. Notify both users to update their chat list
            socket.emit(SocketEvents.CHAT_LIST_UPDATED);
            io.to(receiverId.toString()).emit(SocketEvents.CHAT_LIST_UPDATED);
            console.log('✅ Message sequence complete');

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
