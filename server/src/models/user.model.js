const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },

    lookingFor: {
      type: String,
      enum: ['male', 'female', 'both'],
      required: true,
    },

    birthday: {
      type: Date,
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
      }, // [longitude, latitude]
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);

// Hash password before saving

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
  return this.password === candidatePassword;
};
module.exports = mongoose.model('User', userSchema);
