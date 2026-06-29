const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        const name = users[socket.id];
        delete users[socket.id];
        socket.broadcast.emit('left', name);
    });
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
