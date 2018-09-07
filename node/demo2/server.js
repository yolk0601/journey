var http = require('http');
var fs  = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

//  文件不存在时，发送404
function send404 (response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: ~~~resource not found.');
    response.end();
}

// 文件数据服务，用于发送文件内容
function sendFile (response, filePath, fileContents) {
    response.writeHead(200, {"Content-Type": mime.getType(path.basename(filePath))});
    response.end(fileContents);
}

// 提供静态文件服务
function serverStatic (response, cache, absPath) {
    if (cache[absPath]) {// 检查文件是否缓存在内存中
        sendFile(response, absPath, cache[absPath]);//从内存中返回文件
    } else {
        fs.exists(absPath, function (exists) {// 检查文件是否存在
            if (exists) {
            fs.readFile(absPath, function (err, data) {//从硬盘中读取文件
                if (err) {
                    send404(response)
                } else {
                    cache[absPath] = data;
                    sendFile(response, absPath, data)// 从硬盘中读取文件  
                }
            });
            } else {
                send404(response)
            }
        });
    }
}

// 启动的函数内容在此
var server  = http.createServer(function (request, response) {
    var filePath = false;
    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    serverStatic(response, cache, absPath);
});

server.listen(3000, function () {
    console.log('localhost:3000');
})

// 制定一个模块
var chatServer  = require('./lib/chat_server.js')
chatServer.listen(server);

