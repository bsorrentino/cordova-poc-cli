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
;

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
            throw "not right parameters provided!"
        }

        return processed;
}

function _create(args) {

        if (!args.name) 
            throw "no name provided!"

        return true;
}

function _open(args) {

        if (!args.path)
            throw "no path provided!"
        
        var stats = fs.lstatSync( args.path );
        
        if( !stats.isDirectory() )
            throw  util.format( "path %s doesn't exist!", args.path );
        
        process.chdir( args.path );
        
        
        var json = "{}";
        
        try {
        
            var json = fs.readFileSync( util.format("%s/cordovapoc.json", args.path ), { encoding:'utf8'});
            

        }catch( e ) {
            
            if( e.code === 'ENOENT') {
               
                var rl = readline.createInterface({
                  input: process.stdin,
                  output: process.stdout
                });

                rl.question("do you want create file 'cordovapoc.json' (Y/n)? ", function(answer) {
                 
                  if( answer.match(/^[yY]?/)!==null ) {
                                            
                      rl.question("name of project?", function(name) {

                          if( name ) {
                              
                              json = util.format('{ "name":"%s", "cordova":"", "icon":"" }', name);
                              
                          }
                          else {
                              return false;
                          }
                          
                          rl.close();
                      });
                      rl.prompt();
                      
                  }
                  else {
                      return false;
                  }
                  

                });  

                //throw "project is not 'cordova poc' project (missing cordovapoc.json file)!" 
               
            }
        }
        
        var o = JSON.parse( json );
        
        console.log( util.format("PROJECT: [%s]", o.name ));

        fs.writeFileSync("cordovapoc.json", JSON.stringify(o) );

        var outputFolder = "";
        
        if( args.zip ) {

            console.log( "ZIPPING" );
            
            if( args.o ) {
                outputFolder = args.o + "/";
            }else if( args.output ) {
                outputFolder = args.output + "/";            
            }

            ZIPIT( args.path, util.format( "%s%s.zip", outputFolder, path.basename(args.path) ));		
        }

        return true;
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
/*
function _makeZip( folder ) {
	
	//console.log( "makeZip " + folder  );
	
	var stats = fs.statSync(folder);
	
	if( !stats.isDirectory() ) {
		throw  ""+ folder + " is not a directory!";
	}
	
	ZIPIT( folder, __dirname + '/' + path.basename(folder) + '.zip' );		
}
*/

module.exports = project;
