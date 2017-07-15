var http = require('http');
var port = process.env.port || 8888;

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('hello world');

}).listen(port);

//console.log('Hello world');