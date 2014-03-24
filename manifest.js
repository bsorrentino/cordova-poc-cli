

var fs = require('fs'),
        util = require('util'),
        readline = require('readline')
        ;

var __MANIFEST_FILENAME = "cordovapoc.json";

module.exports = {
    readMF: function() {
        return fs.readFileSync(
                __MANIFEST_FILENAME,
                {encoding: 'utf8'});
    },
    createMF: function(content) {
        fs.writeFileSync(__MANIFEST_FILENAME, content);
    },
    readOrCreateMF: function(onData) {
       
    	var _self = this;
    	
        var result = false;
        
        try {

            var json = module.exports.readMF();
            onData(json);
            result = true;

        } catch (e) {

            if (e.code !== 'ENOENT') {
                console.dir(e);
                throw e;
            }

            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(
                    util.format("do you want create file '%s' (Y/n)? ", __MANIFEST_FILENAME),
                    function(answer) {

                        var m = answer.match(/^[yY]?/);
                        //console.dir(m);
                        if (m && (m[0] !== '' || m.input==='')) {
                        	
                        	var ff  = function(name) {
                                if (name) {
                                    var json = util.format('{ "name":"%s", "cordova":"", "icon":"" }', name);

                                    module.exports.createMF(json);

                                    onData(json);
                                    result = true;
                                }
                                rl.close();
                            };

                            if( _self['name'] ) {
                            	ff( _self['name']  );
                            }
                            else {
                            	rl.question("name of project? ", ff);
                            	rl.prompt();
                            }

                        }
                        else {
                            rl.close();
                        }

                    });

        }
        return result;
    }


}
;
