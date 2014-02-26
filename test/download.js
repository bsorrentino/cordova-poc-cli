

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
      console.log( "downloaded!");
    });
  });
};

var baseUrl = "http://jsfiddle.net/bsorrentino/7XcYS/"

download( url.resolve( baseUrl, "/embedded/result/"), 
         "/tmp/index.html", 
     function( fileName ) {
 
    console.log( "read file %s", fileName);
    fs.readFile( fileName, function(error, data) {
        
        if( error ) throw error;
        
        var html = data.toString("utf8");
        
        $ = cheerio.load(html);
        
        console.log( $.html());

        $("script").each( function(i) {
           
            var src = this.attr("src");
            if( src ) {
                
                var srcUrl = url.resolve( baseUrl, src );
                var urlParts = url.parse(srcUrl);
                
                console.log( "script src=%s", urlParts.href);
                
                var elems = urlParts.pathname.split("/");
                
                //console.dir( urlParts );
                download( srcUrl, util.format("/tmp/%s", elems.slice(-1)) );
            }
        });
    });
} );
