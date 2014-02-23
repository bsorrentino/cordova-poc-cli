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
 
http.createServer(function(request, response) {
  target = request.url;
 
  if(target[0] == "/") // remove the leading forward slash
    target = target.substring(1, target.length);
 
  console.log("Request received. Target: " + target);
 
  // parse the url
  url_parts = url.parse(target);
  if(url_parts.host == undefined) { // stop processing, URL must contain http(s)://
    response.write("ERROR: missing host in target URL " + target);
    response.end();
  }
  else {
 
    var proxy = http.createClient(80, url_parts.host);
    var proxy_request = proxy.request(request.method, url_parts.href, request.headers);
    
    console.log("Creating proxy request to server: " + url_parts.hostname + ", path: " + url_parts.pathname);
    proxy_request.addListener('response', function (proxy_response) {
      proxy_response.addListener('data', function(chunk) {
        response.write(chunk, 'binary');
      });
      proxy_response.addListener('end', function() {
        response.end();
      });
      response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });
    request.addListener('data', function(chunk) {
      proxy_request.write(chunk, 'binary');
    });
    request.addListener('end', function() {
      proxy_request.end();
    });
  }
}).listen(8080);

console.log("Proxy started. Listening to port 8080");

