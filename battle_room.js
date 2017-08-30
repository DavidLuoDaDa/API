var server = require('http').createServer().listen(7000);
var io = require('socket.io')(server);
const uuidv1 = require('uuid/v1');
var redis = require('redis'),
    client = redis.createClient(8000, '220.133.51.181');
//client = redis.createClient(8000, '127.0.0.1');

client.auth('@@Hnn731100@@');

io.sockets.on('connection', function(socket) {

    socket.on('serverjoin', function(data) {

        if (data.room === undefined) {

            var user;

            client.keys('*', function(err, rooms) {
                //if (err) { return console.log(err); }
                var room;
                for (var i in rooms) {
                    room = rooms[i];
                    if (room !== undefined) {
                        client.get(room, function(err, memberid) {
                            if (memberid !== undefined && memberid != data.memberid) {
                                socket.join(room);
                                user = {
                                    'socketid': socket.id,
                                    'memberid': data.memberid,
                                    'roleindex': 2,
                                    'room': room
                                };
                                io.to(room).emit('join', user);
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
                    client.set(room, data.memberid, 'EX', 30);
                    //client.set(room, data.memberid);
                    socket.join(room);
                    user = {
                        'socketid': socket.id,
                        'memberid': data.memberid,
                        'roleindex': 1,
                        'room': room
                    };
                    io.to(room).emit('join', user);
                }
            });
        }
        //io.sockets.emit('join', user);
    });

    socket.on('serverroomready', function(data) {
        //var user = {
        //'socketid': socket.id,
        //'memberid': data.memberid,
        //'roleindex': data.roleindex,
        //'room': data.room
        //};
        io.to(data.room).emit('roomready', data);
    });

    socket.on('servermove', function(data) {
        //var info = {
        //'socketid': socket.id,
        //'memberid': data.memberid,
        //'x': data.x,
        //'y': data.y
        //}

        io.to(data.room).emit('move', data);
        //io.sockets.emit('move', info);
    });

    socket.on('triggerservermove', function(data) {
        //var info = {
        //'socketid': socket.id,
        //'memberid': data.memberid,
        //'x': data.x,
        //'y': data.y
        //}

        io.to(data.room).emit('triggermove', data);
        //io.sockets.emit('move', info);
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