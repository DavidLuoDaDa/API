//http for mongodb
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
app.use(bodyParser.json());

//var port = process.env.port || 8000;
http.createServer(app).listen(8000);

//mongodb
var MongoClient = require('mongodb').MongoClient;
//var Url = 'mongodb://admin:1qazQAZ3edcEDC@220.133.51.181:27017/admin';
var Url = 'mongodb://admin:1qazQAZ3edcEDC@127.0.0.1:27017/admin';

app.post('/Event', function(req, res) {
    var InputData = req.body;

    MongoClient.connect(Url, function(err, client) {
        var db = client.db('Activity');
        var col = db.collection('Event');
        col.insert(InputData, function(err, result) {
            if (err) {
                client.close();
            } else {
                client.close();
            }
        });
    });
});