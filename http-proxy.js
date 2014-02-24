//
// FROM GIST: https://gist.github.com/oscarrenalias/1324360
//
// How to use:
//
// 1. Start node:
//    node nodeproxy.js
// 2. Send a URL like this:
//    http://localhost:8080/http://www.google.com
//
// Watch www.google.com come through your local HTTP proxy.
//
// What is this useful for?
// Cross-domain Ajax requests can be rewritten so that they are routed through the local proxy, this can be easily
// done in your JS code by wrapping them in a function that checks if we're developing locally and if so include
// http://localhost:8080 in front of the URL. You can also extend the prototype of the String class:
//
//  String.prototype. = function() {
//    if(runningLocally) {
//      return("http://localhost:8080" + this);
//    }
//     else {
//      return(this);  
//    }
//  }
//
//  ...
//  $.ajax("http://yoursevice/ajax/request".prx, ...)
//
 

var http = require('http'),
  url = require('url');

module.exports = function PROXY( lport, config) {
	

this.server = http.createServer(function(request, response) {

		var options  = {
			hostname:config.hostname,
			port:config.port
				
		};
		
		target = request.url;

		console.log("Request received. Target: " + target);

		config.url.forEach(function(e) {
			
			if( target.indexOf(e.path)!=-1) {
				
				options.hostname = e.hostname;
				options.port = e.port;
			}
		});
		
		// parse the url
		url_parts = url.parse(target);

		//console.dir(request);

		var encoding = 'utf8';

		options.path = url_parts.href;
		options.methos = request.method;
		options.headers = {};

		for ( var h in request.headers) {
			if (h == "host" || h =="accept-encoding")
				continue;
			options.headers[h] = request.headers[h];
		}
		console.dir(options);

		response.setHeader("Access-Control-Allow-Origin", "*"); 
		var req = http.request(options, function(res) {
			console.log('STATUS: ' + res.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding(encoding);
			res.on('data', function(chunk) {
				response.write(chunk/*, encoding*/);
				
				//var StringDecoder = require('string_decoder').StringDecoder;
				//var decoder = new StringDecoder('utf8');
				//console.log(decoder.write(chunk));
			});
			res.on('end', function() {
				response.end();
			});
		});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			response.end();
		});

		// write data to request body

		req.end();

  
}).listen(lport);

console.log("Proxy started. Listening to port " + lport);

};
