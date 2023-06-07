const Room = require("../model/room");
const Message = require("../model/message");
const User = require("../model/user");
// const socket = require('../socket');

exports.handleCreateRoom = (userId, socket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        const users = await User.find({ role: { $in: [1, 2] } });
        users.push(user);
        if (users) {
          const room = await Room.create({
            users: users,
            client: userId,
          });
          const rooms = await room.populate('client')
          if (rooms) { 
            socket.emit('chat', {action: 'create-room', result: rooms});
            resolve({ statusCode: 200, message: "ok", result: rooms });
          }
        }
      } else {
        resolve({ statusCode: 403, message: "Not found user" });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.handleSendMessage = (userId, content, roomId, socket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        // const room = await Room.findOne({users: {$in: userId}})
        const message = await Message.create({
          content: content,
          creator: userId,
          roomId: roomId,
        });
        const messages = await message.populate('creator', '-password');
        if (messages) {
          // socket.on('send-message', data => {
          //   socket.emit('receiver', data)
          //   console.log(data);
          // })
          resolve({ statusCode: 200, message: "ok", result: messages });
        }
        resolve({ statusCode: 403, message: "Not found user" });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.handleGetRooms = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const rooms = await Room.find().populate("client", "-password");
      if (rooms) {
        resolve({ statusCode: 200, message: "ok", result: rooms });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.handleGetMessage = (roomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const messages = await Message.find({ roomId: roomId }).populate(
        "creator",
        "-password"
      );
      if (messages) {
        resolve({ statusCode: 200, message: "ok", result: messages });
      } else {
        resolve({ statusCode: 403, message: "Not fond message" });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.handleDeleteRoom = (roomId, socket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await Room.findByIdAndDelete(roomId);
      if (room) {
        socket.emit('chat', {action: 'delete-room', result: room});
        resolve({ statusCode: 200, message: "ok", result: room });
      } else {
        resolve({ statusCode: 403, message: "Not found message" });
      }
    } catch (err) {
      reject(err);
    }
  });
};


