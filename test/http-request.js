/**
 * 
 */

var http = require("http");

//http://www.chimerarevo.com/api/1.0/posts/posts.json?page=2
var options = {
  hostname: 'www.chimerarevo.com',
  port: 80,
  path: '/api/1.0/posts/posts.json?page=2',
  method: 'GET'
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body

req.end();

