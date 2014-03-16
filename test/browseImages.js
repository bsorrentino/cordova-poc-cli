/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var fs = require('fs'),
        util = require('util'),
        path = require('path')
;


var folder = '/Users/softphone/WORKSPACES/HTML5/app_spn';
var MAXLEVEL = 2;

var walk = function(dir, level, accept, transform) {
    var results = [];
    
    if( level > MAXLEVEL ) return results;

    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir,file);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {          
            results = results.concat(walk(file, level+1, accept, transform));
        }
        else { 
            if( !accept || accept(file)) {
                results.push( (!transform) ? file : transform(file) ); 
            }
        }
    });
    return results;
};


var images = walk(folder,1, 
        function(file) {

            return  (path.extname(path.basename(file))==='.png');

        },
        function(file) {

            return path.relative( folder, file );
        }
        
    );

console.dir( images );
