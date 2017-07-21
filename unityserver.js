var server = require('http').createServer().listen(7000);
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {

    socket.on('Join', function(data) {
        var user = {
            //'DisplayName': data.DisplayName,
            'SocketID': socket.id
        };
        socket.broadcast.emit('Join', user);
    });

    socket.on('Broadcast', function(data) {
        socket.broadcast.emit('Broadcast', data);
    });

    socket.on('All', function(data) {
        io.sockets.emit('All', data);
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