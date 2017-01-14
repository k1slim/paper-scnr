const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/build'));

let rooms = {};

io.on('connection', function (socket) {
    let code = generateRoomCode();
    rooms[code] = true;
    socket.join(code.toString());
    socket.emit('GENERATE_KEY', {connectKey: code});
    console.log('client rooms', socket.rooms);


    socket.on('CONNECT_TO_ROOM', function (data) {
        if (rooms[parseInt(data.connectKey)]) {
            socket.leave(code.toString());
            socket.join(data.connectKey);
            io.to(data.connectKey).emit('CONNECT_SUCCESSFUL');
        }
    });
});

server.listen(process.env.PORT || 8080);

function generateRoomCode() {
    let code = Math.floor(Math.random() * (10000 - 1000) + 1000);
    while (rooms[code]) {
        code = Math.floor(Math.random() * (10000 - 1000) + 1000);
    }
    return code;
}