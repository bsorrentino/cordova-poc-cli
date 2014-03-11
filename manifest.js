

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
       
        var result = false;
        
        try {

            var json = manifest.readMF();
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

                        console.log("answer %s", answer);
                        var m = answer.match(/^[yY]?/)
                        if (m && m[0] !== '') {

                            rl.question("name of project?", function(name) {

                                if (name) {
                                    var json = util.format('{ "name":"%s", "cordova":"", "icon":"" }', name);

                                    module.exports.createMF(json);

                                    onData(json);
                                    result = true;
                                }
                                rl.close();


                            });
                            rl.prompt();

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
