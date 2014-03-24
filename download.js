

var http = require('http'),
        https = require('https'),
        fs = require('fs'),
        cheerio = require('cheerio'),
        util = require('util'),
        url = require('url')
        ;

var download = function(theUrl, dest, callback) {
    var file = fs.createWriteStream(dest);

    var parts = url.parse(theUrl);

    var onResponse = function(res) {
        // Detect a redirect
        if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
        	console.log( "redirect to [%s] detected! ", res.headers.location);
            // The location for some (most) redirects will only contain the path,  not the hostname;
            // detect this and add the host to the path.
            if (url.parse(res.headers.location).hostname) {
                  // Hostname included; make request to res.headers.location
            	  
            } else {
                  // Hostname not included; get host from requested URL (url.parse()) and prepend to location.
            }
            
            console.log( "redirect is not supported yet. Url will be skipped!")
            return;
        }
        res.pipe(file);
        file.on('finish', function() {
            file.close();
            if (callback)
                callback(dest);
            console.log("%s downloaded!", dest);
        });
    };

    //console.log( "get url [%s] protocol [%s]", parts.href, parts.protocol );

    var request = (parts.protocol === 'https:') ?
            https.get(theUrl, onResponse) :
            http.get(theUrl, onResponse);
};

/**
 * @param {string} baseUrl   url from start download
 * @param {string} targetDir output directory
 */
function downloadUrl(baseUrl, targetDir) {

    var parts = url.parse(baseUrl, false, false);

    var theUrl = baseUrl;

    if (parts.hostname === "jsfiddle.net") {
        console.log("jsfiddle snippet detected!");

        if (parts.pathname.indexOf("show") === -1)
            theUrl = util.format((parts.pathname.slice(-1) === '/') ?
                    "%show/" :
                    "%s/show/", baseUrl);
    }

    fs.mkdir(targetDir, function() {

        download(theUrl,
                util.format("%s/%s", targetDir, "index.original.html"),
                function(fileName) {

                    console.log("read file [%s]", fileName);

                    fs.readFile(fileName, function(error, data) {

                        if (error)
                            throw error;

                        var html = data.toString("utf8");

                        $ = cheerio.load(html);

                        //console.log( $.html());

                        $("script").each(function(i) {

                            var src = this.attr("src");
                            if (src) {

                                var srcUrl = url.resolve(baseUrl, src);
                                var urlParts = url.parse(srcUrl);

                                console.log("script src=%s", urlParts.href);

                                var elems = urlParts.pathname.split("/");

                                var fileName = elems.slice(-1);
                                this.attr("src", util.format("js/%s", fileName));
                                //console.dir( urlParts );
                                fs.mkdir(util.format("%s/js", targetDir), function() {
                                    download(srcUrl, util.format("%s/js/%s", targetDir, fileName));
                                });
                            }
                        });

                        $("link").each(function(i) {

                            var src = this.attr("href");
                            if (src) {

                                var srcUrl = url.resolve(baseUrl, src);
                                var urlParts = url.parse(srcUrl);

                                console.log("link href=%s", urlParts.href);

                                var elems = urlParts.pathname.split("/");

                                var fileName = elems.slice(-1);
                                this.attr("href", util.format("css/%s", fileName));
                                //console.dir( urlParts );
                                fs.mkdir(util.format("%s/css", targetDir), function() {
                                    download(srcUrl, util.format("%s/css/%s", targetDir, fileName));
                                });

                            }
                        });

                        fs.writeFile(util.format("%s/%s", targetDir, "index.html"), $.html(), function(err) {
                            if (err)
                                throw err;
                            //console.log( $.html() );
                        });
                    });
                });

    });

}

module.exports = downloadUrl;
