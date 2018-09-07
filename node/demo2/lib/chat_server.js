var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var nameUsed = [];
var currentRoom = {};

// 分配昵称
function assignGuestName(socket, guestNumber, nickNames, nameUsed) {
    var name  = 'Guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    nameUsed.push(name);
    return guestNumber + 1;
}
// 房间更换请求
function joinRoom (socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room:room});
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + 'has joined' + room + '.'
    });
    var usersInRoom = io.sockets.clients(room);
    if (usersInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ':';
        for(var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if(userSocketId != socket.id){
                if(index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message', {text: usersInRoomSummary})
    }
}
// 昵称更换请求
function hanldNameChangeAttempts (socket, nickNames, nameUsed) {
    socket.on('nameAttempt', function(name){
        if(name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest".'
            });
        } else {
            if (nameUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = nameUsed.indexOf(previousName);
                nameUsed.push[name];
                nickNames[socket.id] = name;
                delete nameUsed[previousNameIndex]
                socket.emit('nameResult', {
                    success: true,
                    name: name
                })
                socket.broadcast.to(currentRoom[socket.id]).emit('message',{
                    text: previousName+' is now known as '+ name + '.'
                })
            } else {
                socket.emit('nameResult',{
                    success: false,
                    message: 'That name is already in use.'
                });
            }
        }
    });
}
// 发送聊天消息
function handleMessageBroadCasting (socket) {
    socket.on('message', function(message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': '+ message.text
        });
    });
}
// 房间创建
function handleRoomJoinning(socket){
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}
// 用户断开链接
function handleClientDisConnection(socket) {
    socket.on('disconnect', function() {
        var nameIndex = nameUsed.indexOf(nickNames[socket.id]);
        delete nameUsed[nameIndex];
        delete nickNames[socket.id];
    });
}
// 确立链接逻辑
exports.listen = function (server) {
    io = socketio.listen(server) 
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, nameUsed);
        joinRoom(socket, 'lobby');
        handleMessageBroadCasting(socket, nickNames);
        hanldNameChangeAttempts(socket, nickNames, nameUsed);
        handleRoomJoinning(socket);
        socket.on('rooms', function () {
            socket.emit('rooms', io.socket.manager.rooms)
        });
        handleClientDisConnection(socket,nickNames,nameUsed);
    });
}