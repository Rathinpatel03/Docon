const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

router.post('/send', ChatController.sendMessage); // POST /chat/send
router.get('/messages/:senderId/:receiverId', ChatController.getMessages); // GET /chat/messages/:sender/:receiver

module.exports = router;