/*
* We use a standard Node.js module to work with UDP
*/
const dgram = require('dgram');
const uuid = require('uuid');
/*
* Let's create a datagram socket. We will use it to send our UDP datagrams
*/
var instruments = {"piano":"ti-ta-ti","trumpet":"pouet","flute":"trulu","violin":"gzi-gzi","drum":"boum-boum"}


const message = new Buffer(instruments[process.argv[2]] + ',' + "1234" + uuid.v4());
const client = dgram.createSocket('udp4');
setInterval(function (){

client.send(message, 0, message.length, 9907, '239.255.22.5');

 process.on('SIGINT', function() {
  process.exit();
 });

}, 1000);

