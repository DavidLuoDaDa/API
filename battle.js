const uuidv1 = require('uuid/v1');

//http for mongodb
//var express = require('express');
//var bodyParser = require('body-Parser');
//var http = require('http');
//var app = express();
//app.use(bodyParser.json());

//var port = process.env.port || 8000;
//http.createServer(app).listen(port).listen(8000);

//mongodb
//var MongoClient = require('mongodb').MongoClient;
//var Url = 'mongodb://admin:1qazQAZ3edcEDC@220.133.51.181:27017/admin';

//app.post('/Event', function(req, res) {
//var InputData = req.body;

//MongoClient.connect(Url, function(err, client) {
//var db = client.db('Activity');
//var col = db.collection('Event');
//col.insert(InputData, function(err, result) {
//if (err) {
//client.close();
//}
//else {
//client.close();
//}
//});
//});
//});

//socket.io
var server = require('http').createServer().listen(9000);
//var io = require('socket.io')(server);
var io = require('socket.io')(server, {
    "serveClient": false,
    "transports": ['websocket', 'polling']
});

//redis
var redis = require('redis'),
    client = redis.createClient(6379, '220.133.51.181');
//client = redis.createClient(8000, '127.0.0.1');

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