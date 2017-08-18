var server = require('http').createServer().listen(7000);
var io = require('socket.io')(server);
const uuidv1 = require('uuid/v1');
var redis = require('redis'),
    client = redis.createClient(8000, '220.133.51.181');

client.auth('@@Hnn731100@@');

client.set(uuidv1().toString(), '123', 'EX', 30);

client.keys('*', function(err, keys) {
    if (err) { return console.log(err); }
    var key;
    for (var i in keys) {
        key = keys[i];
        if (key != 'undefined') {
            console.log(key);
            return;
        }
    }
});

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