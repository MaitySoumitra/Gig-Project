const Chat = require('../models/chatModel');  
const response = require('../utils/response');

const getChatMessages = async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!project_id) {
      return response.error(res, 'Project ID is required');
    }

    const chatMessages = await Chat.find({ projectId: project_id }).sort({ timestamp: 1 });

    if (chatMessages.length === 0) {
      return response.success(res, 'No chat messages found', []);
    }

    return response.success(res, 'Chat messages retrieved successfully', chatMessages);
  } catch (err) {
    console.error(err);
    return response.error(res, 'Failed to retrieve chat messages');
  }
};

module.exports = {
  getChatMessages,
};
