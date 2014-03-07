
var args = process.argv.slice(2);

if( args.length === 0 ) {
	usage();
}

var fs = require('fs');
var path = require('path');
var proxy = require('./http-proxy');
var os=require('os');


// PARSE PARAMETER
var processed = false;
for( var i = 0 ; i < args.length; ++i ) {

	var p = args[i];
	//console.log( "parameter " +p );
	try {
        switch (p) {
            case "project":
                var project = require('./project');
                processed = project( args.slice(++i) );
                i = args.length;
                break;
            case "--zip":
                makeZip(args[++i]);
                processed = true;
                break;
            case "--new-manifest":
                createManifest();
                processed = true;
                break;
            case "--start-proxy":
                startProxy((++i == args.length) ? 8080 : parseInt(args[i]));
                processed = true;
                break;
        }
	}
	catch( err ) {
            console.error( err ); 
            process.exit();
	}
	
}

if( !processed ) {
	usage();
}

function usage() {

	console.error( "usage: cordova-poc [--zip <folder to zip>] [--new-manifest] [--start-proxy [port]]" );
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
function startProxy( port ) {
	printIpAddresses();

	options = require("./proxy.json");
	
	
	var _proxy = new proxy( port, options );

}

