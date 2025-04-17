const Chat = require('../models/ChatModel'); // Create this model if not yet created

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text, timestamp } = req.body;

    const newMessage = new Chat({ senderId, receiverId, text, timestamp });
    await newMessage.save();

    res.status(200).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Failed to get messages' });
  }
};