/**
 * New node file
 */


var url = 'http://www.chimerarevo.com/api/1.0/posts/posts.json?page=2';

var regex = /^(http[s]*[:]\/\/)([\d\.\w]+)(?:\:(\d+))?(\/.+)$/;

var result = url.match(regex);

if( result ) {
	for( var i = 1 ; i <= result.length; ++i ) 
		console.log( "" + result[i] );
	
	//var proxy = "" + result[1] + "localhost" + ( result[2]===undefined) ? "" : "8080" + result[3];
	var proxy = "" + result[1] + "localhost:8080" + result[4];
	
	console.log( proxy );
	
}
else {
	console.log( "doesn't match!");	
	
}
