const dgram = require('dgram');
const server = dgram.createSocket('udp4');

var dateFormat = require('dateformat');


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
		console.log(`active musician: ${activeMusicians[key].address} : ${activeMusicians[key].instrument}:${dateFormat(activeMusicians[key].activeSince}`);
		if (Date.now() - activeMusicians[key].lastMessageDate > 10000) {
		delete activeMusicians[key];
	}
}

}, 1000);

