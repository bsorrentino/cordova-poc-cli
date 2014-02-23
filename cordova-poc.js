
var args = process.argv.slice(2);

if( args.length == 0 ) {

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
		switch( p ) {
		case "--zip":
			makeZip( args[++i] ); 
			processed = true;
			break;
		case "--new-manifest":
			createManifest(); 
			processed = true;
			break;
		case "--start-proxy":
			startProxy(); 
			processed = true;
			break;
		}
	}
	catch( err ) {
		console.error( "error occurred "+ err ); 
	}
	
}

if( !processed ) {
	usage();
}

function usage() {

	console.error( "usage: cordova-poc [--zip <folder to zip>] [--new-manifest] [--start-proxy]" );
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
function startProxy() {
	printIpAddresses();

	options = require("./proxy.json");
	
	
	var _proxy = new proxy( options );

}

function ZIPIT( folder, target ) 
{
		var archiver = require('archiver');
	
		
		var output = fs.createWriteStream(target);
		var archive = archiver('zip');

		output.on('close', function() {
		  console.log(archive.pointer() + ' total bytes');
		  console.log('archiver has been finalized and the output file descriptor has closed.');
		});

		archive.on('error', function(err) {
		  throw err;
		});

		archive.pipe(output);

		archive.bulk([
			{ expand: true, cwd: folder, src: ['**/*.*'] }
		]);

		archive.finalize();

}

/**
makeZip
*/
function makeZip( folder ) {
	
	//console.log( "makeZip " + folder  );
	
	var stats = fs.statSync(folder);
	
	if( !stats.isDirectory() ) {
		throw  ""+ folder + " is not a directory!";
	}
	
	ZIPIT( folder, __dirname + '/' + path.basename(folder) + '.zip' );		
}

