// const { default: mongoose } = require('mongoose');
const { getIO } = require('../config/socket');
const ChatRoom = require('../models/chatRoom.model');

exports.findOrCreateChatRoom = async (user1Id, user2Id) => {
  if (!user1Id || !user2Id) {
    throw new Error(
      'Both user IDs are required to find or create a chat room.'
    );
  }

  try {
    let room = await ChatRoom.findOne({
      participants: { $all: [user1Id, user2Id] },
    });

    if (!room) {
      room = await ChatRoom.create({ participants: [user1Id, user2Id] });

      const io = getIO();
      // io.to(user1Id).emit('chatListUpdated');
      io.to(user2Id).emit('chatListUpdated');
    }
    return room;
  } catch (err) {
    console.error('Error in findOrCreateChatRoom:', err);
    throw new Error(
      'Database error occurred while finding or creating chat room.'
    );
  }
};

exports.getChatRoomsByUser = async (userId) => {
  // const roomsQ = await ChatRoom.aggregate([
  //   {
  //     $match: {
  //       participants: new mongoose.Types.ObjectId(userId),
  //     },
  //   },
  //   {
  //     $addFields: {
  //       otherParticipants: {
  //         $filter: {
  //           input: '$participants',
  //           as: 'participant',
  //           cond: { $ne: ['$$participant', new mongoose.Types.ObjectId(userId)] },
  //         },
  //       },
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'users',
  //       localField: 'otherParticipants',
  //       foreignField: '_id',
  //       as: 'participants',
  //     },
  //   },
  //   {
  //     $project: {
  //       otherParticipants: 0, // optional
  //     },
  //   },
  // ]);
  // return roomsQ;
  // return ChatRoom.find({ participants: userId }).populate('participants');

  const rooms = await ChatRoom.find({ participants: userId })
    .populate('participants', '_id name email')
    .sort({ createdAt: -1 }) // Descending order (latest first)
    .lean();

  const result = rooms.map((room) => {
    const otherUsers = room.participants.filter(
      (p) => p._id.toString() !== userId.toString()
    );

    return {
      ...room,
      participants: otherUsers,
    };
  });

  return result;
};

exports.getChatAllRooms = async () => {
  return ChatRoom.find().populate('participants');
};
