const Message = require('../models/message.model');

exports.sendMessage = async (chatRoomId, senderId, messageText) => {
  const message = await Message.create({
    chatRoom: chatRoomId,
    sender: senderId,
    message: messageText,
    isRead: false,
    sentAt: new Date(),
  });
 await message.populate('sender');

  return message;
};

exports.getMessagesByChatRoom = async (chatRoomId, currentUserId) => {
  const messages = await Message.find({ chatRoom: chatRoomId })
    .populate('sender')
    .sort({ sentAt: 1 });

  // Add "me" or "other" tag to each message
  const taggedMessages = messages.map((msg) => {
    const tag = msg.sender._id.toString() === currentUserId.toString() ? 'me' : 'other';
    return { ...msg.toObject(), tag };
  });

  return taggedMessages;
};