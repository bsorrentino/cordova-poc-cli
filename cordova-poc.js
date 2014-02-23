
var args = process.argv.slice(2);

if( args.length == 0 ) {

	console.error( "usage: cordova-poc [--zip <folder to zip>] [--new-manifest]" );
	process.exit();
}

var fs = require('fs');
var path = require('path');


// PARSE PARAMETER
for( var i = 0 ; i < args.length; ++i ) {

	var p = args[i];
	//console.log( "parameter " +p );
	try {
		switch( p ) {
		case "--zip":
			makeZip( args[++i] ); 
			break;
		case "--new-manifest":
			createManifest(); 
			break;
		}
	}
	catch( err ) {
		console.error( "error occurred "+ err ); 
	}
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

