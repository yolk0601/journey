// 运用http 和 fs 和 流 和管道
var fs  = require('fs')
var http = require('http')


http.createServer(function(req, res){
    res.writeHead(200, {'Content-type': 'image/png'})
    fs.createReadStream('./image.png').pipe(res)
}).listen(3000);
console.log('server running at  localhost:3000')