/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



// Functions which will be available to external callers

var fs = require('fs'),
        util = require('util'),
        readline = require('readline'),
        path = require('path'),
        os  =   require('os')
        downloadUrl = require('./download'),
        manifest = require('./manifest');

;

var IMG_MAXLEVEL = 2;

var walk = function(dir, level, accept, transform) {
    var results = [];
    
    if( level > IMG_MAXLEVEL ) return results;

    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir,file);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {          
            results = results.concat(walk(file, level+1, accept, transform));
        }
        else { 
            if( !accept || accept(file)) {
                results.push( (!transform) ? file : transform(file) ); 
            }
        }
    });
    return results;
};


var chooseImage = function( folder, callback ) {
    
    var images = walk(folder, 1,
        function(file) { return path.extname(path.basename(file))==='.png'; },
        function(file) { return path.relative( folder, file ); }
        
    );
    
    var index = 0;
    images.forEach( function(file) {
       
        console.log( util.format( "[%d] %s", index++, file ));
    });
    
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(
            "Choose image: ",
            function(answer) {
                
                var n = parseInt(answer);
                
                callback(images[n]);

                rl.close();
            });
};

function project(argv) {

        var args = require('minimist')(argv);
        //console.dir(args);

        if (args._.length === 0) 
            throw "not enought parameters provided!"
        
        var processed = false;
        
        
        switch (args._[0]) {
            case "open":
                processed = _open(args);
                break;
            case "create":
                processed = _create(args);
                break;
        }

        if (!processed) {
            throw "not right parameters provided!";
        }

        return processed;
}

/*
* > cordova-poc project create --name=<name> --url=<url> [--output=<output parent folder>]
*/
function _create(args) {

        if (!args.name) 
            throw "no name provided!";
        if (!args.url) 
            throw "no url provided!";

		var outdir = path.join( (args.o)?args.o:'', 
                        (args.output)?args.output:'', 
                        path.basename(args.name) );
                        
        downloadUrl( args.url,  outdir );
        
        return true;
}

/*
* > cordova-poc project open --path=<project path> 
*                   [--zip] 
*                   [--output=<zip output folder>]
*                   [--set-name=<poc name>]
*                   [--set-icon]
*                   [--set-version=<version number>]
*                   
*/
function _open(args) {

        if (!args.path)
            throw "no path provided!";
        
        var stats = fs.lstatSync( args.path );
        
        if( !stats.isDirectory() )
            throw  util.format( "path %s doesn't exist!", args.path );
        
        process.chdir( args.path );
 
        var updated = false;
        
        var finalize = function(o) {

            console.log( "MANIFEST:" );
            console.dir( o );

            if(updated) {
                manifest.createMF( JSON.stringify(o) );
            }

            if( args.zip ) 
                _makeZip( args );
            
        } ;
        manifest.readOrCreateMF(function(content) {
                var o = JSON.parse( content );

                console.dir( o );

                if( args['set-name'] ) {
                    updated = true;
                    o.name = args['set-name'];
                }
                if( args['set-version'] ) {
                    updated = true;
                    o.cordova = args['set-version'];
                }
                if( args['set-icon'] ) {
                    updated = true;
                    chooseImage(args.path, function(icon) {
                        
                        if( icon ) o.icon = icon;
                        
                        finalize(o);
                    });
                }
                else {
                    finalize(o);
                }
                
        });
        
        //console.dir(args);
           
        return true;
}

/**
 * 
 * @param {string} folder description
 * @param {string} target description
*/
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
 * 
 * @param {object} args arguments 
 *         
*/
function _makeZip( args ) {
	
        console.log( "ZIPPING" );

        ZIPIT( args.path, 
            path.join( (args.o)?args.o:'', 
                        (args.output)?args.output:'', 
                        path.basename(args.path) + ".zip" ));		
}

module.exports = project;
