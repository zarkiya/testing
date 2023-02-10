const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mysql = require('mysql2');
const path = require('path');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// app.get('/', function (req, res) {
//   res.render('index', {
//     username: 'Guest'
//   });
// });

app.get('/chat-app', function(req, res){
    connection.query("SELECT * FROM messages", function (error, result, fields) {
      res.render('index', {username: '', chats: result });
    });
  });

//   app.get('/', function(req, res){
//     connection.query("SELECT * FROM messages", function (error, result, fields) {
//       res.render('index', { username: 'Guest', chats: result });
//     });
//   });

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
      connection.query(
        'INSERT INTO messages (username, message) VALUES (?, ?)',
        [msg.username, msg.message],
        function (error) {
          if (error) throw error;
  
          io.sockets.emit('chat message', msg);
        }
      );
    });
});
  
//     socket.on('typing', function (data) {
//       socket.broadcast.emit('typing', data);
//     });
//   

  server.listen(3000, function () {
    console.log('Listening on *:3000');
  });
  