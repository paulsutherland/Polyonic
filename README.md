# Polyonic
## The ultimate "Universal App"
> Now using the latest Ionic 4.0.0-beta.15 release and Electron 3.0.5 and Angular 7.0.0 :tada:
> This branch is testing the very latest packages, so it is very likley to break!

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![devDependencies Status](https://david-dm.org/paulsutherland/Polyonic/dev-status.svg)](https://david-dm.org/paulsutherland/Polyonic?type=dev)
[![optionalDependencies Status](https://david-dm.org/paulsutherland/Polyonic/optional-status.svg)](https://david-dm.org/paulsutherland/Polyonic?type=optional)
[![GitHub version](https://badge.fury.io/gh/paulsutherland%2FPolyonic.svg)](https://badge.fury.io/gh/paulsutherland%2FPolyonic)

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)

#### Build once using web technologies and deploy everywhere!
An Electron Ionic application shell for creating Web Apps, Progressive Mobile Web Apps, Native Mobile Apps and Desktop Apps.

This project combines the <a href="http://electron.atom.io/">Electron Framework</a> with <a href="http://ionicframework.com/docs/v2/">Ionic</a> and provides a starter for building out an app that can run on either the desktop (macOS, Windows and Linux), a browser or mobile devices (iOS, Android and Windows Phone).  You can use this application to build and run on one or even all of these platforms.

# Motivation
When working in small teams creating web and mobile applications, it is difficult and time consuming for new team members to pick up the different technologies for each platform. I have also been asked a few questions that motivated me to try Polyonic out:
- Is there a way to run this mobile app on the desktop?
- Can we cache more in the browser for offline working?
- Can we have one Universal app that can run on the desktop, mobile, web and Office 365?

These questions made me think about the limitations of the browser for off-line editing and caching and was there a way to create a package that can be used to flesh out any app we require, whilst reducing the overhead of having to learn numerous libraries and frameworks for each platform.

And that is why I decided to try combining Electron and Ionic. Is it wise to have a universal app using a mobile framework? Probably not, but it is fun :wink:

# Quick start
The dependencies for this project are <a href="https://nodejs.org">Node.js</a>, <a href="http://ionicframework.com/docs/v2/getting-started/installation/">Ionic Framework</a> and <a href="https://www.npmjs.com/package/cordova">Cordova</a>.

You will need:

The latest Node 10 and NPM 6+ installed.

Make sure you have node installed and running, then install Ionic and Cordova globally using npm.
```
npm install -g ionic@latest cordova
```
Clone the repo, change into the Polyonic directory, install the npm packages and run the Electron app
```
git clone --depth 1 https://github.com/paulsutherland/Polyonic
cd Polyonic
git fetch origin beta:beta
git checkout beta

npm install
npm run electron:local
```
You now have Electron and Ionic running as a Desktop app.

# Running Live Reload for Electron Development
When developing a desktop app, you will want to have the app live reload as you save your changes.
```
npm run electron
```
or
```
npm run ionic
```
# Building on Windows
For building on Windows you will need to install the Nullsoft Scriptable Install System.

You can download NSIS <a href="http://nsis.sourceforge.net/Main_Page">here</a>

You will need to make sure the NSIS path is added as an environment variable:
```
setx PATH "%PATH%;C:\Program Files (x86)\NSIS"
```

Or using <a href="http://nsis.sourceforge.net/Main_Page">point and click.</a>

# Credits
This application was built using the <a href="http://electron.atom.io/">Electron Framework</a> for creating desktop apps and <a href="http://ionicframework.com/">Ionic 2</a> for the UI and creating Native Mobile Applications, Progressive Mobile Web Applications and Web Applications.

# Todo
- Add Office 365 add-in code for running Polyonic in Office 365 applications.
- Add instructions for running Polyonic on the Hololens (Yep we can) :sunglasses:.

# License
Released under the MIT license.
