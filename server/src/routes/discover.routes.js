const express = require('express');
const router = express.Router();
const discoverController = require('../controllers/discover.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, discoverController.getNearbyUsers);

module.exports = router;
