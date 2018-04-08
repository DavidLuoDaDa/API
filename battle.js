var server = require('http').createServer().listen(9000);
var io = require('socket.io')(server);
//var io = require('socket.io')(server, {
//"serveClient": false,
//"transports": ['websocket', 'polling']
//});

const uuidv1 = require('uuid/v1');
var redis = require('redis'),
    client = redis.createClient(6379, '220.133.51.181');
//client = redis.createClient(8000, '127.0.0.1');

client.auth('@@Hnn731100@@');

io.sockets.on('connection', function(socket) {

    socket.on('serverjoin', function(data) {

        //if (room === undefined) {
        //if (data.roomnumber === undefined) {

        var Result;
        client.keys('*', function(err, rooms) {

            var room = '';
            for (var i in rooms) {
                room = rooms[i];
                if (room !== undefined) {

                    client.get(room, function(err, reply) {
                        json = JSON.parse(reply);
                        if (json !== undefined && json.memberid != data.memberid) {
                            socket.join(room);
                            Result = {
                                //'socketid': socket.id,
                                'memberid': data.memberid,
                                'room': room,
                                'init': 0,
                                'roleindex': 2,
                                'xarray': json.x,
                                'indexarray': json.index
                            };
                            io.to(room).emit('join', Result);
                            client.del(room, function(err, reply) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(reply);
                                }
                            });
                        }
                    });
                    break;
                }
            }

            if (rooms.length === 0) {
                if (room === '') {
                    room = uuidv1().toString();
                } else {
                    room = data.roomnumber;
                }
                //client.set(room, data.memberid, 'EX', 30);
                //client.set(room, data.memberid);

                //var redisdata = {};
                //redisdata["memberid"] = data.memberid;
                //redisdata["x"] = data.x;
                //redisdata["index"] = data.index;

                //client.set(room, JSON.stringify(redisdata), 'EX', 30);
                //client.set(room, JSON.stringify(data), 'EX', 30);
                client.set(room, JSON.stringify(data), 'EX', 30);

                socket.join(room);
                Result = {
                    //'socketid': socket.id,
                    'memberid': data.memberid,
                    'room': room,
                    'init': 1,
                    'roleindex': 1
                };

                io.to(room).emit('join', Result);
            }
        });
        //}
    });

    socket.on('serverroomready', function(data) {
        io.to(data.room).emit('roomready', data);
    });

    socket.on('servermove', function(data) {
        io.to(data.room).emit('move', data);
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