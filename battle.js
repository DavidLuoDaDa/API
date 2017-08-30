var server = require('http').createServer().listen(7000);
var io = require('socket.io')(server);
const uuidv1 = require('uuid/v1');
var redis = require('redis'),
    client = redis.createClient(8000, '220.133.51.181');
//client = redis.createClient(8000, '127.0.0.1');

client.auth('@@Hnn731100@@');

io.sockets.on('connection', function(socket) {

    socket.on('serverjoin', function(data) {

        var user;
        client.keys('*', function(err, rooms) {
            //if (err) { return console.log(err); }
            var room;
            for (var i in rooms) {
                room = rooms[i];
                if (room !== undefined) {
                    client.get(room, function(err, socketid) {
                        if (socketid !== undefined && socketid != socket.id) {

                            user = {
                                'socketid': socket.id,
                                'enemysocketid': socketid,
                                'roleindex': 2,
                                'room': room
                            };
                            socket.emit('join', user);
                            client.del(room, function(err, reply) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(reply);
                                }
                            });
                        }
                    });
                }
            }

            if (rooms.length === 0) {
                room = uuidv1().toString();
                //client.set(room, socket.id, 'EX', 30);
                client.set(room, socket.id);
                user = {
                    'socketid': socket.id,
                    'roleindex': 1,
                    'room': room
                };
                socket.emit('join', user);
            }
        });
    });

    socket.on('serverroomready', function(data) {
        socket.broadcast.to(data.enemysocketid).emit('roomready', data);
    });

    socket.on('servermove', function(data) {
        socket.broadcast.to(data.enemysocketid).emit('move', data);
    });

    socket.on('triggerservermove', function(data) {
        socket.broadcast.to(data.enemysocketid).emit('triggermove', data);
    });

    socket.on('serverbroadcast', function(data) {
        socket.broadcast.emit('broadcast', data);
    });

    socket.on('serverall', function(data) {
        io.sockets.emit('all', data);
    });
});

function addladder() {
    var info = {
        ladderx: 1.8 - (Math.random() * 3.6),
        laddery: -6,
        ladderindex: Math.floor((Math.random() * 4) + 1)
    }
    io.sockets.emit('ladder', info)
}

setInterval(addladder, 1500);