var net = require('net');
var HOST = '172.17.0.2';
var PORT = 2205;

var active = false;
// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
	console.log('Active musician sent');
	console.log();

	var tabMusicians = [];
	for (var key in activeMusicians) {
		var tabMusician = {};
		tabMusician["\nuuid"] = activeMusicians[key].uuid;
		tabMusician["\ninstrument"] = activeMusicians[key].instrument;
		tabMusician["\nactiveSince"] = activeMusicians[key].activeSince;
		tabMusicians.push(tabMusician);
	}
	// Write the data back to the socket, the client will receive it as data from the server
	sock.write(JSON.stringify(tabMusicians) + '\n');

}).listen(PORT, HOST);

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

var instruments = {"ti-ta-ti":"piano","pouet":"trumpet","trulu":"flute","gzi-gzi":"violin","boum-boum":"drum"};
var activeMusicians = {};

function Musician(instrument, date){
	this.instrument = instrument;
	this.uuid = generateUUID();
	this.lastMessageDate = date;
	this.activeSince = new Date(date).toUTCString();
}

server.on('message', (msg, rinfo) => {
	if (!activeMusicians[rinfo.address]){
		activeMusicians[rinfo.address] = new Musician(instruments[msg], Date.now());
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
	if (!Object.keys(activeMusicians).length && !active){
		console.log(`No active musician`);
		active = true;
	} else {
		for (var key in activeMusicians) {
			//console.log(`active musician: ${activeMusicians[key].address} : ${activeMusicians[key].instrument}:${new Date(activeMusicians[key].activeSince).toUTCString()}`);
			if (Date.now() - activeMusicians[key].lastMessageDate > 10000) {
			delete activeMusicians[key];
		}
		active = false;
	}
	
	
}

}, 1000);




