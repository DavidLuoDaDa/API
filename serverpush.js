//var socket = io.connect('http://timeinnovation.cloudapp.net:7000');
var socket = io.connect('http://127.0.0.1:7000');
//var socket = io.connect('http://220.133.51.181:7000');

var funcName;
//var CurrentRoom = '';

function Chat_Broadcast() {
    funcName = 'Chat_Broadcast';
    SendMessage();
}

function Chat_All() {
    funcName = 'Chat_All';
    SendMessage();
}

function Chat_Whisper() {
    funcName = 'Chat_Whisper';
    SendMessage();
}

function Chat_GroupRoom() {

    GetCurrentRoom();
    socket.emit('Chat_GroupRoom', {
        'ID': CurrentRoom,
        'DisplayName': $('#DisplayName').val(),
        'Message': $('#Message').val()
    });
    $('#Message').val('');
}

function JoinRoom() {

    GetCurrentRoom();
    socket.emit('Chat_JoinRoom', {
        //'OldRoom': OldRoom,
        'CurrentRoom': CurrentRoom
    });
    alert('加入' + CurrentRoom + '群組聊天');
}

function LeaveRoom() {

    GetCurrentRoom();
    socket.emit('Chat_LeaveRoom', {
        'CurrentRoom': CurrentRoom
    });
    alert('離開' + CurrentRoom + '群組聊天');
}

function GetCurrentRoom() {
    CurrentRoom = $('#Room :selected').text();
}

function SendMessage() {

    socket.emit(funcName, {
        'ID': $('#Users').val(),
        'DisplayName': $('#DisplayName').val(),
        'Message': $('#Message').val()
    });
    $('#Message').val('');
}

socket.on('Join', function(data) {
    $("#Users").append($("<option></option>").attr("value", data.SocketID).text(data.DisplayName));
});


socket.on('Broadcast', function(data) {
    $('#Discussion').append('<li>[廣播]來自<strong>' + data.DisplayName +
        '</strong>:&nbsp;&nbsp;' + data.Message + '</li>')
});

socket.on('All', function(data) {
    $('#Discussion').append('<li>[廣播]來自<strong>' + data.DisplayName +
        '</strong>:&nbsp;&nbsp;' + data.Message + '</li>')
});

socket.on('Whisper', function(data) {
    $('#Discussion').append('<li>[私聊] 來自<strong>' + data.DisplayName +
        '</strong>:&nbsp;&nbsp;' + data.Message + '</li>')
});

socket.on('GroupRoom', function(data) {
    $('#Discussion').append('<li>[群組 ' + data.ID + '] 來自<strong>' + data.DisplayName +
        '</strong>:&nbsp;&nbsp;' + data.Message + '</li>')
});

$(function() {
    $('#Message').val('');
    $('#DisplayName').val(prompt('Enter your name:', ''));

    socket.emit('Chat_Join', {
        'DisplayName': $('#DisplayName').val()
    });
})