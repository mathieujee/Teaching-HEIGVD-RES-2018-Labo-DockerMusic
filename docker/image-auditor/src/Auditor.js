var dgram = require('dgram');
var net   = require('net');
var s     = dgram.createSocket('udp4');
var moment = require('moment');

// UUID generator compliant with RFC4122
const uuidv4 = require('uuid/v4'); 

var activeMusicians = new Map();

s.on('message', function(msg, source) {
	var newMusician = JSON.parse(msg);
	var musicianAlreadyExists = false;
	
	// update 'lastSound' of the new musician	
	activeMusicians.forEach(function(m, uuid, activeMusicians) {
		if(uuid == newMusician.uuid) {
			m.lastSound = moment();
			musicianAlreadyExists = true;
			
			console.log("update lastSound.");
			return;
		}
	});

	// if the musician wasn't already in the array,
	// add the new musician
	if(!musicianAlreadyExists) {
		
		var m = new Object();
		m.uuid = newMusician.uuid;
		m.instrument  = newMusician.instrument;
		m.activeSince = moment();
		m.lastSound   = moment();

		activeMusicians.set(m.uuid, m);
		console.log("added the new musician.");
	}

});

s.on('listening', function(msg, source) {
	console.log("Server is listening...");
});

s.on('error', function(msg, source) {
	s.close();
});

s.bind(2205, function() {
	s.addMembership("239.255.22.5");
});


// look for inactive musician every second
setInterval(function() {
	
	activeMusicians.forEach(function(m, uuid, activeMusicians) {
		if(moment().diff(m.lastSound) > 5000) {
			activeMusicians.delete(uuid);
			console.log("Delete inactive musician.");
		}
	});

}, 1000);


var serv = net.createServer(function(socket) {

	var tmpMusicians = [];

	activeMusicians.forEach(function(m, uuid, activeMusicians) {
		tmpMusicians.push({
			"uuid": uuid,
			"instrument": m.instrument,
			"activeSince": m.activeSince
		});
	});
	
	socket.write(JSON.stringify(tmpMusicians) + "\r\n");
	socket.pipe(socket);
	socket.end();
});

// Server is listening
serv.listen(2205, "0.0.0.0");
