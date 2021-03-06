const uuidv1 = require('uuid/v1');

//socket.io
//var io = require('socket.io')(server);
var server = require('http').createServer().listen(9000);
var io = require('socket.io')(server, {
    "serveClient": false,
    "transports": ['websocket', 'polling']
});

//redis
var redis = require('redis'),
    client = redis.createClient(6379, '127.0.0.1');
//client = redis.createClient(6379, '220.133.51.181');


client.auth('@@Hnn731100@@');
io.sockets.on('connection', function(socket) {

    socket.on('serverjoin', function(data) {

        var Result;

        //自訂遊戲
        if (data.roomnumber !== undefined && data.roomnumber !== null && data.roomnumber !== '') {
            client.get(data.roomnumber, function(err, reply) {
                json = JSON.parse(reply);
                if (json !== undefined &&
                    json !== null &&
                    json !== '' &&
                    json.memberid != data.memberid) {
                    socket.join(data.roomnumber);
                    Result = {
                        //'socketid': socket.id,
                        'memberid': data.memberid,
                        'room': data.roomnumber,
                        'init': 0,
                        'roleindex': 2,
                        'xarray': json.x,
                        'indexarray': json.index
                    };
                    io.to(data.roomnumber).emit('join', Result);
                    client.del(data.roomnumber, function(err, reply) {
                        //if (err) {
                        //console.log(err);
                        //} else {
                        //console.log(reply);
                        //}
                    });
                } else {

                    client.set(data.roomnumber, JSON.stringify(data), 'EX', 15);
                    //client.set(data.roomnumber, JSON.stringify(data));

                    socket.join(data.roomnumber);
                    Result = {
                        //'socketid': socket.id,
                        'memberid': data.memberid,
                        'room': data.roomnumber,
                        'init': 1,
                        'roleindex': 1
                    };

                    io.to(data.roomnumber).emit('join', Result);
                }
            });
        }
        //隨機對戰
        else {
            client.keys('*', function(err, rooms) {
                var room = '';
                for (var i in rooms) {
                    room = rooms[i];
                    if (room !== undefined && room !== null && room !== '') {
                        client.get(room, function(err, reply) {
                            json = JSON.parse(reply);
                            if (json !== undefined &&
                                json !== null &&
                                json !== '' &&
                                json.memberid != data.memberid) {
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
                                    //if (err) {
                                    //console.log(err);
                                    //} else {
                                    //console.log(reply);
                                    //}
                                });
                            }
                        });
                        break;
                    }
                }

                if (rooms.length === 0) {
                    room = uuidv1().toString();

                    client.set(room, JSON.stringify(data), 'EX', 15);
                    //client.set(room, JSON.stringify(data));

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
        }
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