cordova-poc-cli
===============

cordova-poc command line interface


### Create project from an URL

```
 > cordova-poc project create --name=<name> --url=<url> [--output=<output parent folder>]
```
#### project create parameters:
 name |  mandatory | description 
------------- | ------------- |------------- |
--name  | yes | name of new project | 
--url  | yes | url from which download the source code snippet. Could be either a [JSFiddle](http://jsfiddle.net/) url or a [Codepen](http://codepen.io/) url | 
--output  | no | target folder | 

### Open project (and create application manifest)

```
 > cordova-poc project open --path=<project path> [--zip] [--output=<zip output folder>]
```

 
