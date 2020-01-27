const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

app.use(express.static(path.join(__dirname, '/client')));

const messages = [];
const users = [];

app.get('*', (req, res) => {
  res.render('./client/index.html');
});

const server = app.listen(8000);

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', () => { console.log('Oh, I\'ve got something from ' + socket.id) });

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('login', (user) => {
    console.log('Oh, I\'ve got a new user logged in - ' + user.name);
    const message = ({ author: 'Chat Bot', content: user.name + ' has joined the conversation!'})
    
    messages.push(message);
    socket.broadcast.emit('message', message);

    const newUser = {
      name: user.name,
      id: socket.id,
    };

    users.push(newUser);
  });

  socket.on('disconnect', () => {
    let exitingUser = '';

    const deleteUser = (user, index) => {
      if(user.id === socket.id) {
        users.splice(index, 1)
        exitingUser = user.name;
      };
    };

    users.some(deleteUser);
    const message = ({ author: 'Chat Bot', content: exitingUser + ' has left the conversation... :('});
    socket.broadcast.emit('message', message);
    console.log('Oh, socket ' + socket.id + ' has left')
  });


});

