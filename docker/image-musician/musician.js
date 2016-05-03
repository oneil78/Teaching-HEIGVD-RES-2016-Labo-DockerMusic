
var protocol = require('./sensor-protocol');
/*
* We use a standard Node.js module to work with UDP
*/
var dgram = require('dgram');
/*
* Let's create a datagram socket. We will use it to send our UDP datagrams
*/

const message = new Buffer('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 2205, 'localhost', (err) => {
  client.close();
});

process.on('SIGINT', function() {
process.exit();
});


