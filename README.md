
> <span style='color:red'>**ANNOUNCEMENT**</span>:
>
> on Apr 24, 2019 the IOS version of this app has been removed by App Store
> from Apple for the reasons state below
>
>Your app appears to be designed for clients or users to preview apps prior to being >submitted to the App Store for review. This type of design allows you to change your >app’s behavior or functionality to differ from the intended and advertised primary purpose of your app, which is not in compliance with [App Store Review Guideline 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements) and section 3.3.2 of the [Apple Developer Program License Agreement](https://developer.apple.com/terms/).
>
>For this reason, your app will be removed from the App Store. Customers who have previously downloaded this app will continue to have access to it on their devices and will have access to any available in-app purchase products.


# cordova-poc-cli

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
path&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | yes | path where is locate project |
set-name  | no | set the project's name. It defines the app's label in cordova-poc |
set-version  | no | Set the preferred cordova version. If set, cordova-poc will not ask for it on app launch. The version must be set using an integer that represent vestion. As example for version '3.0.0' you have to put the number 300  |
set-icon  | no | If set, will be showed a list of png files belonging to project and will be asked to select one of them |
zip  | no | If set, the folder will be zipped to be ready to upload in order to make it available to cordova-poc (target name will be '&lt;project name&gt;'.zip) |
output  | no | Set the output folder for zip (default is 'path' value)  |
