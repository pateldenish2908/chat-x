const Message = require('../models/message.model');

exports.sendMessage = async (chatRoomId, senderId, receiverId, contentText) => {
  const message = await Message.create({
    messageId: require('uuid').v4(),
    chatRoom: chatRoomId,
    sender: senderId,
    receiver: receiverId,
    content: contentText,
    status: 'sent'
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