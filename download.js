

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

    var onResponse = function(response) {
        response.pipe(file);
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

        if (parts.pathname.indexOf("embedded/result") === -1)
            theUrl = util.format((parts.pathname.slice(-1) === '/') ?
                    "%sembedded/result/" :
                    "%s/embedded/result/", baseUrl);
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
