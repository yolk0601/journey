var events = require('events');
var net  = require('net');
var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
    this.clients[id] = client;
    this.subscriptions[id] = function(senderId, message) {
        if(id != senderId) {
            this.clients[id].write(message);
        }
    }
    //  添加一个专门针对当前用户的broadcast事件监听器
    this.on('broadcast', this.subscriptions[id]);
});
channel.on('leave', function (id) {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id+ " has left the chat. \n");
});

var server  = net.createServer(function(client) {
    var id = client.remoteAddress + ':' + client.remotePort;
    client.on('connect', function () {
        channel.emit('join', id, client);
    })
    client.on('data', function (data) {
        data = data.toString();
        channel.emit('broadcast', id ,data);
    })
    client.on('close', function () {
        channel.emit('leave', id);
    })
})

server.listen(3001)

channel.on('shutdown', function () {
    channel.emit('broadcast', '', "chat has shut down.\n")
    channel.removeAllListenners('broadcast');
})
client.on('data', function (data) {
    data = data.toString();
    if(data == "shutdown\r\n") {
        channel.emit('shutdown');
    }
    channel.emit('broadcast', id, data)
})