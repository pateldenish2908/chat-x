// seedUsers.ts

const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");


const MONGODB_URI = 'mongodb://localhost:27017/chatapp';

const CENTRAL_COORDINATES = [72.8777, 19.0760]; // Mumbai [lng, lat]

function generateRandomNearbyCoordinates(base, radiusInKm = 2) {
  const [lng, lat] = base;

  const r = radiusInKm / 111; // 1 degree ~ 111km
  const randomLat = lat + (Math.random() - 0.5) * 2 * r;
  const randomLng = lng + (Math.random() - 0.5) * 2 * r;

  return [parseFloat(randomLng.toFixed(6)), parseFloat(randomLat.toFixed(6))];
}

async function seedUsers() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

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

  await User.insertMany(users);
  console.log('Users seeded successfully');
  await mongoose.disconnect();
}

seedUsers().catch((err) => {
  console.error(err);
  // eslint-disable-next-line no-undef
  process.exit(1);
});
