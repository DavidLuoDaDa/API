var server = require('http').createServer().listen(9000);
var io = require('socket.io')(server, {
    "serveClient": false,
    "transports": ['websocket', 'polling']
});

const uuidv1 = require('uuid/v1');
var redis = require('redis'),
    client = redis.createClient(6379, '220.133.51.181');
//client = redis.createClient(8000, '127.0.0.1');

client.auth('@@Hnn731100@@');

io.sockets.on('connection', function(socket) {

    socket.on('serverjoin', function(data, data1, data2, data3) {

        if (data.room === undefined) {

            var user;

            client.keys('*', function(err, rooms) {
                //if (err) { return console.log(err); }
                var room;
                for (var i in rooms) {
                    room = rooms[i];
                    if (room !== undefined) {
                        //client.get(room, function(err, memberid) {
                        //if (memberid !== undefined && memberid != data.memberid) {
                        client.get(room, function(err, result) {
                            result = JSON.parse(result);
                            if (result !== undefined && result.memberid != data.memberid) {
                                socket.join(room);
                                user = {
                                    'socketid': socket.id,
                                    'memberid': data.memberid,
                                    'roleindex': 2,
                                    'room': room,
                                    'xarray': result.x,
                                    'indexarray': result.index,
                                    'init': 0
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
                    if (data.roomnumber === '') {
                        room = uuidv1().toString();
                    } else {
                        room = data.roomnumber;
                    }
                    //client.set(room, data.memberid, 'EX', 30);
                    //client.set(room, data.memberid);
                    client.set(room, JSON.stringify(data), 'EX', 30);
                    //client.set(room, JSON.stringify(data));
                    socket.join(room);
                    user = {
                        'socketid': socket.id,
                        'memberid': data.memberid,
                        'roleindex': 1,
                        'room': room,
                        'init': 1
                    };
                    io.to(room).emit('join', user);
                }
            });
        }
    });

    socket.on('serverroomready', function(data) {
        io.to(data.room).emit('roomready', data);
    });

    socket.on('servermove', function(data) {
        io.to(data.room).emit('move', data);
    });

    socket.on('triggerservermove', function(data) {
        io.to(data.room).emit('triggermove', data);
    });

    socket.on('serverrestartgame', function(data) {
        io.to(data.room).emit('restartgame', data);
    });

    socket.on('serverbroadcast', function(data) {
        socket.broadcast.emit('broadcast', data);
    });

    socket.on('serverall', function(data) {
        io.sockets.emit('all', data);
    });
});

//function addladder() {
//  var info = {
//    ladderx: 1.6 - (Math.random() * 3.2),
//  laddery: -6,
//ladderindex: Math.floor((Math.random() * 4) + 1)
//}
//io.sockets.emit('ladder', info)
//}

//setInterval(addladder, 600);