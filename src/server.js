var express = require('express');  
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('<h1>你好web秀</h1>');
});
 
io.on('connection',function(socket) {
  //接收数据
  socket.on('login', function (obj) {                
      console.log(obj.username);
      // 发送数据
      socket.emit('relogin', {
        msg: `你好${obj.username}`,
        code: 200
      });  
  });
});
 
http.listen(4000, function(){
  console.log('listening on *:4000');
});








// begin web socket
// const http = require("http");
// const socketIO = require('socket.io');


// var server = http.createServer();
// server.listen(3000);
// server.on('error', onError);
// server.on('listening', onListening);

// var io = socketIO.listen(server);

// var mySocket = require('./mySocket.js');
// mySocket(io);

// console.log("创建socket成功");

// function onListening() {
// 	var addr = server.address();
// 	var bind = typeof addr === 'string'
// 		? 'pipe ' + addr
// 		: 'port ' + addr.port;
// 	debug('Listening on ' + bind);
// 	console.log('Listening on ' + bind)
// }

// function onError(e) {
// 	console.log('Socket io got error' + e)
// }

// end web socket