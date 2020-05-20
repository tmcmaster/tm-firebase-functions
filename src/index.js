import {createFunctions as createUser} from './main/user.js';
import {createFunctions as createCron} from './main/cron.js';
import {createFunctions as createItem} from './app/item.js';
import {createFunctions as createJoin} from './app/join.js';

import {Firebase} from '@wonkytech/tm-firebase-service';

function createGenericFunctions(functions, admin, dbName, appName, includeCron) {

    const mainApp = admin.initializeApp({databaseURL: `https://${dbName}.firebaseio.com/`}, 'main');
    const appApp = admin.initializeApp({databaseURL: `https://${dbName}-${appName}.firebaseio.com/`}, appName);

    const mainDb = admin.database(mainApp);
    const appDb = admin.database(appApp);

    const mainFuncDb = functions.database;
    const appFuncDb = functions.database.instance('tm-firebase-pwa-app');

    const exportMap = {main: {}, app: {}};

    admin.initializeApp(functions.config().firebase);

    const db = admin.database();
    const funcDb = functions.database;

    Object.assign(exportMap.main, createUser(appFuncDb, appDb, mainFuncDb, mainDb, functions));
    if (includeCron) {
        Object.assign(exportMap.main, createCron(funcDb, db, mainFuncDb, mainDb, functions));
    }
    Object.assign(exportMap.app, createItem(appFuncDb, appDb, mainFuncDb, mainDb, functions));
    Object.assign(exportMap.app, createJoin(appFuncDb, appDb, mainFuncDb, mainDb, functions));

    return exportMap;
}

export {Firebase, createGenericFunctions}
