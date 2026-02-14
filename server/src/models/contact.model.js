const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  lastMessage: String,
  time: String,
  online: Boolean,
  lastSeen: String,
});

module.exports = mongoose.model('Contact', contactSchema);
