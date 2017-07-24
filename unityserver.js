var server = require('http').createServer().listen(7000);
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {

    socket.on('serverjoin', function(data) {
        var user = {
            'socketid': socket.id
        };
        io.sockets.emit('join', user);
    });

    socket.on('servermove', function(data) {
        var info = {
            'socketid': socket.id,
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

    //socket.on('Chat_JoinRoom', function(data) {      
    //socket.join(data.CurrentRoom);
    //});
    //
    //socket.on('Chat_LeaveRoom', function(data) {
    //socket.leave(data.CurrentRoom);
    //});
    //
    //socket.on('Chat_Whisper', function(data) {
    //socket.broadcast.to(data.ID).emit('Whisper', data);
    //});
    //
    //socket.on('Chat_GroupRoom', function(data) {
    //socket.broadcast.to(data.ID).emit('GroupRoom', data);
    //});

});