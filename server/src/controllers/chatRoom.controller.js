const chatRoomService = require('../services/chatRoom.service');

exports.createOrGetChatRoom = async (req, res) => {
  try {
    const { userId1 , userId2 } = req.body;
    const chatRoom = await chatRoomService.findOrCreateChatRoom(userId1, userId2);
    res.status(200).json(chatRoom);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getMyChatRooms = async (req, res) => {
  try {
    const userId = req.params.userId;
    const chatRooms = await chatRoomService.getChatRoomsByUser(userId);
    res.status(200).json(chatRooms);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getChatAllRooms = async (req, res) => {
  try {
    const chatRooms = await chatRoomService.getChatAllRooms();
    res.status(200).json(chatRooms);
  } catch (error) {
   throw new Error(error.message);
  }
};

