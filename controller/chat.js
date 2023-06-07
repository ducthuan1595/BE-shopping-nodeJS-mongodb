const chatService = require('../services/chat');

exports.createRoom = async(req, res) => {
    const { userId } = req.body;
    const socket = req.app.get("socketio");
    // console.log(req.body);
    if(!userId) {
      res.status(404).json({ message: 'Invalid value' })
    }else {
      const data = await chatService.handleCreateRoom(userId, socket);
      if(data) {
        res.status(data.statusCode).json({ message: data.message, result: data.result });
      }
    }
};

exports.sendMessage = async(req, res) => {
  const { userId , content, roomId } = req.body;
  const socket = req.app.get("socketio");

  if(!userId || !content || !roomId) {
    res.status(404).json({ message: 'Invalid value' })
  }
  else if(roomId === 'undefined') {
    res.status(404).json({ message: 'Invalid value' })
  }
  else {
    const data = await chatService.handleSendMessage(userId, content, roomId, socket);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, result: data.result });
    }
  }
}

exports.getRooms = async(req, res) => {
    const data = await chatService.handleGetRooms();
    if(data) {
      res.status(data.statusCode).json({ message: data.message, result: data.result });
    }
  }


exports.getMessages = async(req, res) => {
  const { roomId } = req.params;
  if(!roomId) {
    res.status(404).json({ message: 'Invalid value' })
  }else {
    const data = await chatService.handleGetMessage(roomId);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, result: data.result });
    }
  }
};

exports.deleteRoom = async(req, res) => {
  const { roomId } = req.params;
  const socket = req.app.get("socketio");
  if(!roomId) {
    res.status(404).json({ message: 'Invalid value' })
  }else {
    const data = await chatService.handleDeleteRoom(roomId, socket);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, result: data.result });
    }
  }
}

