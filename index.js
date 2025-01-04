const express = require('express');
const serverless = require('serverless-http');

const app = express();
const http = require("http").createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: ["http://localhost:3000", "https://dynohubscreencase.vercel.app"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        transports: ["polling"]
    },
});

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '/display.html');
});

io.on('connection', (socket) => {
    console.log("Socket.io connection success");
    socket.on("join-message", (roomId) => {
        console.log("join-message emitted");
        socket.join(roomId);
        console.log("User joined in a room: " + roomId);
    });

    socket.on("screen-data", (data) => {
        data = JSON.parse(data);
        let room = data.room;
        let imgStr = data.image;
        socket.broadcast.to(room).emit('screen-data', imgStr);
    });
});

module.exports = http;
module.exports.handler = serverless(http);
