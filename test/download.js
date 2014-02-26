

var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var util = require('util');
var url = require('url');

var download = function(url, dest, callback) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      if( callback) callback( dest );
      console.log( "%s downloaded!", dest);
    });
  });
};

var baseUrl = "http://codepen.io/andreasstorm/full/peCbd"
//var baseUrl = "http://jsfiddle.net/hellosze/t22QP";
//var baseUrl = "http://jsfiddle.net/bsorrentino/YXJMk";
var targetDir = "/tmp/project2";


var jsfiddle = util.format( "%s/embedded/result/", baseUrl);
var codepen = baseUrl;

fs.mkdir( targetDir, function() {


download( codepen, 
          util.format( "%s/%s", targetDir, "index.original.html"), 
          function( fileName ) {
 
    console.log( "read file [%s]", fileName);
    
    fs.readFile( fileName, function(error, data) {
        
        if( error ) throw error;
        
        var html = data.toString("utf8");
        
        $ = cheerio.load(html);
        
        //console.log( $.html());

        $("script").each( function(i) {
           
            var src = this.attr("src");
            if( src ) {
                
                var srcUrl = url.resolve( baseUrl, src );
                var urlParts = url.parse(srcUrl);
                
                console.log( "script src=%s", urlParts.href);
                
                var elems = urlParts.pathname.split("/");
                
                var fileName = elems.slice(-1);
                this.attr("src", util.format( "js/%s", fileName) );
                //console.dir( urlParts );
                fs.mkdir( util.format("%s/js", targetDir), function() {
                    download( srcUrl, util.format("%s/js/%s", targetDir,fileName) );
                });
            }
        });
        
        $("link").each( function(i) {
           
            var src = this.attr("href");
            if( src ) {
                
                var srcUrl = url.resolve( baseUrl, src );
                var urlParts = url.parse(srcUrl);
                
                console.log( "link href=%s", urlParts.href);
                
                var elems = urlParts.pathname.split("/");
                
                var fileName = elems.slice(-1);
                this.attr("href", util.format("css/%s",fileName) );
                //console.dir( urlParts );
               fs.mkdir( util.format("%s/css", targetDir), function() {
                    download( srcUrl, util.format("%s/css/%s", targetDir,fileName) );
                });
                
            }
        });
        
        fs.writeFile( util.format( "%s/%s", targetDir, "index.html"), $.html(), function(err) {
            if( err ) throw err;
            //console.log( $.html() );
        });
    });
} );
});


