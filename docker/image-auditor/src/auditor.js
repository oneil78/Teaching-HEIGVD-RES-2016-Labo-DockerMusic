var net = require('net');
var HOST = '172.17.0.2';
var PORT = 2205;
// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {

        console.log('TCP connection : active musician sent');
        console.log();

        // Write the data back to the socket, the client will receive it as data from the server
        sock.write(JSON.stringify(activeMusicians));
		if (data == 'q'){
			sock.close();
		}
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

var instruments = {"ti-ta-ti":"piano","pouet":"trumpet","trulu":"flute","gzi-gzi":"violin","boum-boum":"drum"};
var activeMusicians = {};

function Musician(address, instrument, date){
	this.address = address;
	this.instrument = instrument;
	this.uuid = generateUUID();
	this.lastMessageDate = date;
	this.activeSince = date;
}

server.on('message', (msg, rinfo) => {
	if (!activeMusicians[rinfo.address]){
		activeMusicians[rinfo.address] = new Musician(rinfo.address, instruments[msg], Date.now());
	} else {
		activeMusicians[rinfo.address].lastMessageDate = Date.now();
	}
	console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.bind(9907, function() {
console.log("Joining multicast group");
server.addMembership('239.255.22.5');});

process.on('SIGINT', function() {
  process.exit();
 });
 
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

setInterval(function (){
	for (var key in activeMusicians) {
		//console.log(`active musician: ${activeMusicians[key].address} : ${activeMusicians[key].instrument}:${new Date(activeMusicians[key].activeSince).toUTCString()}`);
		if (Date.now() - activeMusicians[key].lastMessageDate > 10000) {
		delete activeMusicians[key];
	}
}

}, 1000);




