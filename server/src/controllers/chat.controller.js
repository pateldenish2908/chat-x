const Contact = require('../models/Contact');
const Message = require('../models/Message');



// Seed dummy contacts (run only once or on demand)
// eslint-disable-next-line no-unused-vars
async function seedContacts() {
  const count = await Contact.countDocuments();
  if (count > 0) return;

  const contacts = [
    {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Hey, how are you doing?',
      time: '10:30 AM',
      online: true,
      lastSeen: 'today at 10:30 AM',
    },
    {
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'See you tomorrow!',
      time: '9:15 AM',
      online: false,
      lastSeen: 'today at 9:15 AM',
    },
    {
      name: 'Bob Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Thanks for the help!',
      time: 'Yesterday',
      online: false,
      lastSeen: 'yesterday at 6:45 PM',
    },
    {
      name: 'Alice Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      lastMessage: "Let's meet up soon",
      time: 'Yesterday',
      online: true,
      lastSeen: 'today at 2:15 PM',
    },
  ];

  await Contact.insertMany(contacts);
  console.log('Dummy contacts seeded');
}
// seedContacts();

exports.getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

exports.getMessages = async (req, res) => {
  const { contactId } = req.params;
  const messages = await Message.find({ contactId });
  res.json(messages);
};
