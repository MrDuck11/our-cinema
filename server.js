const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Раздаем статические файлы из корня папки
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);

        socket.on('video-action', (data) => {
            socket.to(roomId).emit('video-action', data);
        });

        socket.on('change-source', (source) => {
            io.to(roomId).emit('change-source', source);
        });

        socket.on('chat-message', (msg) => {
            io.to(roomId).emit('chat-message', msg);
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));