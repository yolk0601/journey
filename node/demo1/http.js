var http = require('http')

http.createServer(function(req, res){
    res.writeHead(200, {'Content-type': 'text/plain'})
    res.end('hello world');
}).listen(3000);
console.log('server running at  localhost:3000')

// 换一种写法
var server = http.createServer()
server.on('request', function(req, res) {
    res.writeHead(200, {'Content-type': 'text/plain'})
    res.end('hello world');
});
server.listen(3000);
console.log('server running at  localhost:3000');