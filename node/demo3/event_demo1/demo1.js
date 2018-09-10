// 不完整代码 学习所用代码
// 事件发射器
var net = require('net');
var server  = net.createServer = net.createServer(function (socket) {
    // 当读取到新数据时候处理data事件
    // on 是持续监听
    socket.on('data', function (data) {
        // 数据回写到客户端
        socket.write(data);
    });
});
server listen(8888)

// 事件发射器 可以只噶生一次
var net  = require('net');
var server  = net.createServer(function (socket) {
    socket.once('data', function () {
        socket.write(data)
    })
})