const { default: mongoose } = require('mongoose');
const User = require('../models/user.model');
const ChatRoom = require('../models/chatRoom.model');

const registerUser = async (body) => {
  try {
    const { email, password, name, gender, lookingFor, birthday, location } =
      body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error('Email already exists');
    }

    const user = await User.create({
      email,
      password, // You should hash the password in production
      name,
      gender,
      lookingFor,
      birthday,
      location,
    });

    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  return user;
};

// Create new user
const addUser = async (userData) => {
  return await User.create(userData);
};

// Update existing user
const updateUser = async (id, userData) => {
  const user = await User.findByIdAndUpdate(id, userData, { new: true });
  if (!user) throw new Error('User not found');
  return user;
};

// Delete user
const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found');
  return user;
};

// Get user by ID
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  return user;
};

// Get all users
const getAllUsers = async () => {
  return await User.find();
};

// Pagination, Searching, Sorting
const getUserWithPaginationSearchingAndSorting = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  const searchQuery = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ],
  };

  const users = await User.find(searchQuery)
    .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(searchQuery);

  return {
    data: users,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getNearbyUsers = async (
  userId,
  longitude,
  latitude,
  maxDistance = 5000
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Get all chat rooms for user and extract participant IDs
  const chatRooms = await ChatRoom.find({ participants: userId }).lean();

  const existingParticipantIds = new Set();
  chatRooms.forEach((room) => {
    room.participants.forEach((participantId) => {
      if (participantId.toString() !== userId.toString()) {
        existingParticipantIds.add(participantId.toString());
      }
    });
  });

  // Prepare $nin array for users already in chat room
  const excludedUserIds = Array.from(existingParticipantIds);

  const nearbyUsers = await User.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        distanceField: 'distance',
        spherical: true,
        maxDistance: maxDistance,
        query: {
          _id: {
            $nin: [
              ...excludedUserIds.map((id) => new mongoose.Types.ObjectId(id)),
              new mongoose.Types.ObjectId(userId),
            ],
          },
        },
      },
    },
    {
      $project: {
        password: 0,
      },
    },
    { $limit: 50 },
    { $sort: { distance: 1 } }, // Sort by distance
  ]);

  if (!nearbyUsers.length) {
    throw new Error('No nearby users found');
  }

  return nearbyUsers;
};

// const getNearbyUsers_ = async (
//   userId,
//   longitude,
//   latitude,
//   maxDistance = 5000
// ) => {
//   const user = await User.findById(userId);
//   if (!user) throw new Error('User not found', 404);

//   const nearbyUsers = await User.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: 'Point',
//           coordinates: [longitude, latitude],
//         },
//         distanceField: 'distance', // This field will hold distance for each doc
//         spherical: true,
//         maxDistance: maxDistance, // in meters
//         query: { _id: { $ne: new mongoose.Types.ObjectId(userId) } },
//       },
//     },
//     {
//       $project: {
//         password: 0, // Exclude password
//       },
//     },
//     {
//       $limit: 50,
//     },
//   ]);

//   // const nearbyUsers = await User.find({
//   //   _id: { $ne: userId }, // Exclude self
//   //   location: {
//   //     $near: {
//   //       $geometry: { type: 'Point', coordinates: [longitude, latitude] },
//   //       $maxDistance: maxDistance, // in meters
//   //     },
//   //   },
//   // }).select('-password').limit(50); // Limit to 10 nearby users

//   if (!nearbyUsers.length) {
//     throw new Error('No nearby users found', 404);
//   }

//   return nearbyUsers;
// };

const updateLocation = async (req, res, next) => {
  try {
    const { longitude, latitude } = req.body;
    const userId = req.params.userId;

    await User.findByIdAndUpdate(userId, {
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    next(error);
  }
};

const CENTRAL_COORDINATES = [72.8777, 19.076]; // Mumbai [lng, lat]

function generateRandomNearbyCoordinates(base, radiusInKm = 2) {
  const [lng, lat] = base;

  const r = radiusInKm / 111; // 1 degree ~ 111km
  const randomLat = lat + (Math.random() - 0.5) * 2 * r;
  const randomLng = lng + (Math.random() - 0.5) * 2 * r;

  return [parseFloat(randomLng.toFixed(6)), parseFloat(randomLat.toFixed(6))];
}

async function seedUsers() {
  await User.deleteMany({}); // Optional: clear users

  const users = [];

  for (let i = 1; i <= 20; i++) {
    const coords = generateRandomNearbyCoordinates(CENTRAL_COORDINATES);

    users.push({
      name: `User${i}`,
      email: `user${i}@example.com`,
      password: 'password123', // hash if needed
      gender: i % 2 === 0 ? 'male' : 'female',
      lookingFor: 'both',
      birthday: new Date(1995, 0, i), // Jan 1 to 20, 1995
      location: {
        type: 'Point',
        coordinates: coords,
      },
      isActive: true,
      isVerified: true,
    });
  }
  try {
    await User.insertMany(users);
    console.log('Users seeded successfully');
    return 'Users seeded successfully';
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser,
  addUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
  getUserWithPaginationSearchingAndSorting,
  updateLocation,
  getNearbyUsers,
  seedUsers,
};
