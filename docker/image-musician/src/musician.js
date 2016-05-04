/*
* We use a standard Node.js module to work with UDP
*/
const dgram = require('dgram');
/*
* Let's create a datagram socket. We will use it to send our UDP datagrams
*/

const message = new Buffer(process.argv[2]);
const client = dgram.createSocket('udp4');
//var m = new Musician();
setInterval(function (){

client.send(message, 0, message.length, 9907, '239.255.22.5');

 process.on('SIGINT', function() {
  process.exit();
 });

}, 1000);

