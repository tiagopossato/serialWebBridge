const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log("Conectado!");
  //https://serialport.io/
  const port = new SerialPort("/dev/ttyACM0", { baudRate: 115200 });
  const parser = new Readline();
  port.pipe(parser);
  
  parser.on('data', data => io.emit('message', data));

  socket.on('message', function (msg) {
    console.log(msg);
    port.write(`${msg}\n`);    
  });
});


http.listen(port, function () {
  console.log('listening on *:' + port);
});