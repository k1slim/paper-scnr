const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/build'));

let rooms = {};

io.on('connection', function (socket) {
    let code = generateRoomCode();
    rooms[code] = true;
    socket.join(code.toString(), () => console.log('connected client rooms', socket.rooms));
    socket.emit('GENERATE_KEY', {connectKey: code});

    socket.on('CONNECT_TO_ROOM', function (data) {
        if (rooms[parseInt(data.connectKey)]) {

            //Leave from the initially created room and join to the room by connect key
            socket.leave(code.toString(), () => console.log('after leave', socket.rooms));
            delete rooms[code];

            socket.join(data.connectKey, () => console.log('after join', socket.rooms));
            io.to(data.connectKey).emit('CONNECT_SUCCESSFUL');
        }
    });

    socket.on('disconnect', function () {
        delete rooms[code];
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