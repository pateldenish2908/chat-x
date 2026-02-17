const express = require('express');
const router = express.Router();
const blockController = require('../controllers/block.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/block', authMiddleware, blockController.blockUser);
router.post('/unblock', authMiddleware, blockController.unblockUser);
router.get('/', authMiddleware, blockController.getBlockedUsers);

module.exports = router;
