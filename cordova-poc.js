
var args = process.argv.slice(2);

if( args.length === 0 ) {
	usage();
}

var fs = require('fs');
var path = require('path');
var os=require('os');


// PARSE PARAMETER
var processed = false;
var i = 0;
var p = args[i];

//console.log( "parameter " +p );
try {
    switch (p) {
        case "project":
            var project = require('./project');
            processed = project( args.slice(++i) );
            i = args.length;
            break;
        case "start-proxy":
        	printIpAddresses();
        	var proxy = require('./http-proxy');
        	var _proxy = new proxy( (++i == args.length) ? 8080 : parseInt(args[i]) );
            processed = true;
            break;
    }
}
catch( err ) {
        console.error( err ); 
        process.exit();
}
	

if( !processed ) {
	usage();
}

function usage() {
    var pjson = require('./package.json');
    console.error( "version: " + pjson.version );
    console.error( "usage: cordova-poc [project create|open ....] [start-proxy [port]]" );
    process.exit();
	
}

function printIpAddresses() {
	var ifaces=os.networkInterfaces();
	for (var dev in ifaces) {
	  var alias=0;
	  ifaces[dev].forEach(function(details){
	    if (details.family=='IPv4') {
	      console.log(dev+(alias?':'+alias:''),details.address);
	      ++alias;
	    }
	  });
	}	

}

