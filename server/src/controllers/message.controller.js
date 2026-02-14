const messageService = require('../services/message.service');

exports.sendMessage = async (req, res, next) => {
  try {
    const { chatRoom, sender, message } = req.body;
    const savedMessage = await messageService.sendMessage(
      chatRoom,
      sender,
      message
    );
    res.status(201).json(savedMessage);
  } catch (error) {
    next(error);
  }
};

exports.getMessagesByChatRoom = async (req, res, next) => {
  try {
    const chatRoomId = req.params.chatRoomId;
    const userId = req.user.id;
    const messages = await messageService.getMessagesByChatRoom(
      chatRoomId,
      userId
    );
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
