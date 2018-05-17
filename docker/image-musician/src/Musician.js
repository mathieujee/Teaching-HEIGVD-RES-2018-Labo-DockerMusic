var dgram = require('dgram');
var s = dgram.createSocket('udp4');

// UUID generator compliant with RFC4122
const uuidv4 = require('uuid/v4'); 

var musician = new Object();
musician.uuid = uuidv4();
musician.instrument = process.argv[2];
musician.sound = ""

switch(musician.instrument) {
	case "piano": 
		musician.sound = "ti-ta-ti";
		break;
	
	case "trumpet":
		musician.sound = "pouet";
		break;
	
	case "flute":
		musician.sound = "trulu";
		break;
	
	case "violin":
		musician.sound = "gzi-gzi";
		break;
	
	case "drum":
		musician.sound = "boum-boum";
		break;
	
	default:
		musician.sound = "no sound";
}

var json_text = JSON.stringify(musician);
message = new Buffer(json_text);	

// play a sound every second
setInterval(function() {
	  s.send(message, 0, message.length, 2205, "239.255.22.5", function(err, bytes){});
	}, 1000);

