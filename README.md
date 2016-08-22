# Polyonic
## The ultimate "Universal App"

####Build once using web technologies and deploy everywhere!
An Electron Ionic application shell for creating Web Apps, Progressive Mobile Web Apps, Native Mobile Apps and Desktop Apps.

This project combines the [Electron Framework] (http://electron.atom.io/) with [Ionic 2](http://ionicframework.com/docs/v2/) and provides a starter for building out an app that can run on either the desktop (macOS, Windows and Linux), a browser or mobile devices (iOS, Android and Windows Phone).  You can use this application to build and run on one or even all of these platforms.

#Motivation
When working in small teams creating web and mobile applications, it is difficult and time consuming for new team members to pick up the different technologies for each platform. I have also been asked a few questions that motivated me to try Polyonic out: 
- Is there was way to run this mobile app on the desktop?
- Can we cache more in the browser for offline working?
- Can we have one Universal app that can run on the desktop, mobile, web and Office 365?

These questions made me think about the limitations of the browser for off-line editing and caching and was there a way to create a package that can be used to flesh out any app we require, whilst reducing the overhead of having to learn numerous libraries and frameworks for each platform.

And that is why I decided to try combining Electron and Ionic. Is it wise to have a universal app using a mobile framework? Probably not, but it is fun :wink:

> Please be aware that this project is using beta software and you should give careful consideration about using it in production until the up stream frameworks are stable.  Angular2 is at 'release candidate' status and the Ionic team are waiting for Angular2 to be released before Ionic2 gets a stable production release.  Until then we can expect breaking changes.


# Quick start
The dependencies for this project are [Node.js](https://nodejs.org), [Ionic2 Framework] (http://ionicframework.com/docs/v2/getting-started/installation/) and [Cordova] (https://www.npmjs.com/package/cordova).

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
npm run live
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
This application was built using the [Electron Boilerplate Project] (https://github.com/szwacz/electron-boilerplate/blob/master/README.md) for scaffolding out the Electron application, the [Electron Framework] (http://electron.atom.io/) for creating desktop apps and [Ionic 2](http://ionicframework.com/) for the UI and creating Native Mobile Applications, Progressive Mobile Web Applications and Web Applications.

# Todo
- Add Karma and Protractor testing frameworks.  Use [Lathonez's example] (http://lathonez.github.io/2016/ionic-2-unit-testing/) in his [Clicker app] (https://github.com/lathonez/clicker) until the [Angular 2 testing docs] (https://angular.io/docs/ts/latest/testing/) are complete.
- Add Office 365 add-in code for running Polyonic in Office 365 applications.
- Add instructions for running Polyonic on the Hololens (Yep we can) :sunglasses:.
- Remove express as we can run a simple node http server instead.  As it stands this app is just an example of what can de done.

# License
Released under the MIT license.
