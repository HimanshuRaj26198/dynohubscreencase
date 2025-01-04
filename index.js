const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/display.html')
})

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
        socket.broadcast.to(room).emit('screen-data', imgStr)
    })
})


const server_port = process.env.YOUR_PORT || process.env.PORT || 5000;

http.listen(server_port, () => {
    console.log("Started on:" + server_port)
})