var server = require('http').createServer().listen(7000);
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {

    socket.on('serverjoin', function(data) {
        var user = {
            'socketid': socket.id,
            'memberid': data.memberid
        };
        io.sockets.emit('join', user);
    });

    socket.on('servermove', function(data) {
        var info = {
            'socketid': socket.id,
            'memberid': data.memberid,
            'x': data.x,
            'y': data.y
        }
        io.sockets.emit('move', info);
    });

    socket.on('serverbroadcast', function(data) {
        socket.broadcast.emit('broadcast', data);
    });

    socket.on('serverall', function(data) {
        io.sockets.emit('all', data);
    });

});