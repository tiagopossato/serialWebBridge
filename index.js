const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
var open = require("open");


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
  const port = new SerialPort("/dev/ttyUSB0", { baudRate: 115200 });
  const parser = new Readline();
  port.pipe(parser);
  
  parser.on('data', data => io.emit('message', data));

  socket.on('message', function (msg) {
    console.log(msg);
    port.write(`${msg}\n`);    
  });


   socket.on('disconnect', function() {
      console.log('Got disconnect!');
try{
        port.close(()=>{console.log("Porta fechada");});
}catch(e){console.error(e);}
   });

});


http.listen(port, function () {
  console.log('listening on *:' + port);
  open(`http://localhost:${port}`, 'google-chrome');
});