const io = require('socket.io');

function initSocket(server) {
  const socket = io(server);

  function onConnect(client) {
    console.log('Client connected');

    client.emit('message', 'Hello from server');

    client.on('event', (data) => {
      console.log('Received event from client:', data);
    });

    client.on('disconnect', () => {
      console.log('Client disconnected');
    });

    
  }

  socket.on('connection', onConnect);

  return socket;
}

module.exports = {
  init: initSocket,
};
