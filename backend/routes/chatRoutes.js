const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/:project_id', chatController.getChatMessages);

module.exports = router;
