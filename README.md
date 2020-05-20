# tm-firebase-functions

This component is used to create a generic set of Firebase functions, 
which help in the development of PWAs.

## Installation
```bash
npm install @wonkytech/tm-firebase-functions
```

## An example of a functions/index.js file
```html
const databaseName = 'tm-firebase-pwa';
const appName = 'my-app';
const includeCronJobs = false;

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firebasePWA = require('@wonkytech/tm-firebase-pwa');

Object.assign(exports, firebasePWA.createGenericFunctions(functions, admin, databaseNAme, appName, includeCronJobs));
```