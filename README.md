
cordova-poc-cli
===============

[cordova-poc](http://bsorrentino.github.io/cordova-poc/) command line interface


## Install

```
 > npm install -g cordova-poc

```

## update

```
 > npm update -g cordova-poc

```

## Usage


### Create project from an URL

```
 > cordova-poc project create   --name=<name> 
                                --url=<url> 
                                [--output=<output parent folder>]
```
#### project create parameters:
 name |  mandatory | description 
------------- | ------------- |------------- |
name  | yes | name of new project | 
url  | yes | url from which download the source code snippet. Could be either a [JSFiddle](http://jsfiddle.net/) url or a [Codepen](http://codepen.io/) url | 
output  | no | target folder | 

### Open project (and create application manifest)

```
 > cordova-poc project open --path=<project path> 
                            [--set-name=<poc name>]
                            [--set-version=<version number>]
                            [--set-icon]
                            [--zip] 
                            [--output=<zip output folder>]
 ```
#### project open parameters:
                   
 name |  mandatory | description 
------------- | ------------- |------------- |
path  | yes | path where is locate project | 
set-name  | no | set the project's name. It defines the app's label in cordova-poc | 
set-version  | no | Set the preferred cordova version. If set, cordova-poc will not ask for it on app launch. The version must be set using an integer that represent vestion. As example for version '3.0.0' you have to put the number 300  | 
set-icon  | no | If set, will be showed a list of png files belonging to project and will be asked to select one of them | 
zip  | no | If set, the folder will be zipped to be ready to upload in order to make it available to cordova-poc  | 
output  | no | Set the output folder for zip   | 


 
