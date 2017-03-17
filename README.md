# Polyonic
## The ultimate "Universal App"
> Now using the latest Ionic 2.2.0 release :tada:

> Note: Me (North) has forked this repo to fix up the code base and get it running with the latest ionic :)

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![dependencies Status](https://david-dm.org/paulsutherland/Polyonic/status.svg)](https://david-dm.org/paulsutherland/Polyonic)
[![devDependencies Status](https://david-dm.org/paulsutherland/Polyonic/dev-status.svg)](https://david-dm.org/paulsutherland/Polyonic?type=dev)
[![optionalDependencies Status](https://david-dm.org/paulsutherland/Polyonic/optional-status.svg)](https://david-dm.org/paulsutherland/Polyonic?type=optional)
[![GitHub version](https://badge.fury.io/gh/paulsutherland%2FPolyonic.svg)](https://badge.fury.io/gh/paulsutherland%2FPolyonic)

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)

#### Build once using web technologies and deploy everywhere!
An Electron Ionic application shell for creating Web Apps, Progressive Mobile Web Apps, Native Mobile Apps and Desktop Apps.

This project combines the <a href="http://electron.atom.io/">Electron Framework</a> with <a href="http://ionicframework.com/docs/v2/">Ionic 2</a> and provides a starter for building out an app that can run on either the desktop (macOS, Windows and Linux), a browser or mobile devices (iOS, Android and Windows Phone).  You can use this application to build and run on one or even all of these platforms.

# Motivation
When working in small teams creating web and mobile applications, it is difficult and time consuming for new team members to pick up the different technologies for each platform. I have also been asked a few questions that motivated me to try Polyonic out: 
- Is there was way to run this mobile app on the desktop?
- Can we cache more in the browser for offline working?
- Can we have one Universal app that can run on the desktop, mobile, web and Office 365?

These questions made me think about the limitations of the browser for off-line editing and caching and was there a way to create a package that can be used to flesh out any app we require, whilst reducing the overhead of having to learn numerous libraries and frameworks for each platform.

And that is why I decided to try combining Electron and Ionic. Is it wise to have a universal app using a mobile framework? Probably not, but it is fun :wink:

# Getting Started

1) Clone this repo

2) Overwrite the contents of the 'src' directory with the contents in the root directory of your ionic app

3) Run `npm run create` to copy the new build tools in and modify your package.json for electron

4) Run `npm run dev` to boot up your ionic app, the electron app, and start the live reload

# Quick start
The dependencies for this project are <a href="https://nodejs.org">Node.js</a>, <a href="http://ionicframework.com/docs/v2/getting-started/installation/">Ionic2 Framework</a> and <a href="https://www.npmjs.com/package/cordova">Cordova</a>.

Make sure you have node installed and running, then install Ionic and Cordova globally using npm.
```
npm install -g ionic@beta cordova
```
Clone the repo, change into the Polyonic directory, install the npm packages and run the Electron app
```
git clone https://github.com/paulsutherland/Polyonic.git
cd Polyonic

npm install
npm start
```
You now have Electron and Ionic running as a Desktop app.

# Running Live Reload for Electron Development
When developing a desktop app, you will want to have the app live reload as you save your changes.  
```
npm run dev
```
# Ionic CLI Commands
When developing a web app, progressive app or native mobile app, all of the Ionic CLI commands are available when you are in the src directory, as this is a standard Ionic app.  Change into the src directory and run commands from the Ionic CLI.  
```
cd src
ionic

eg:
ionic serve --lab --port 4000 -r
```

# Credits
This application was built using the <a href="https://github.com/szwacz/electron-boilerplate/blob/master/README.md">Electron Boilerplate Project</a> for scaffolding out the Electron application, the <a href="http://electron.atom.io/">Electron Framework</a> for creating desktop apps and <a href="http://ionicframework.com/">Ionic 2</a> for the UI and creating Native Mobile Applications, Progressive Mobile Web Applications and Web Applications.

# Todo
- Add Karma and Protractor testing frameworks.  Use <a href="http://lathonez.github.io/2016/ionic-2-unit-testing/">Lathonez's example</a> in his <a href="https://github.com/lathonez/clicker">Clicker app</a> until the <a href="https://angular.io/docs/ts/latest/testing/">Angular 2 testing docs</a> are complete.
- Add Office 365 add-in code for running Polyonic in Office 365 applications.
- Add instructions for running Polyonic on the Hololens (Yep we can) :sunglasses:.
- Remove express as we can run a simple node http server instead.  As it stands this app is just an example of what can de done.

# License
Released under the MIT license.
