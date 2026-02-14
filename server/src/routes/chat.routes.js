const express = require('express');
const router = express.Router();
const { getContacts, getMessages } = require('../controllers/chat.controller');

router.get('/contacts', getContacts);
router.get('/messages/:contactId', getMessages);

module.exports = router;
