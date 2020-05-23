import {createFunctions as createUser} from './main/user.js';
import {createFunctions as createCron} from './main/cron.js';
import {createFunctions as createItem} from './app/item.js';
import {createFunctions as createJoin} from './app/join.js';

function createGenericFunctions(functions, admin, config) {

    // const dbNameMain = config.main.dbName;
    // const appNameScema = config.apps.schema.dbName;
    // const includeCron = config.main.includeCron;
    // const appName = 'schema'
    // const mainApp = admin.initializeApp({
    //     databaseURL: `https://${dbNameMain}.firebaseio.com/`
    // }, 'main');
    // const appApp = admin.initializeApp({
    //     databaseURL: `https://wonky-tech-schema.firebaseio.com/`
    // }, appName);
    // const mainDb = admin.database(mainApp);
    // const appDb = admin.database(appApp);
    // const mainFuncDb = functions.database;
    // const appFuncDb = functions.database.instance('wonky-tech-f49bd');
    // const exportMap = {
    //     main: {},
    //     app: {}
    // };


    const dbNameMain = config.main.dbName;
    const includeCron = config.main.includeCron;
    const mainApp = admin.initializeApp({databaseURL: `https://${dbNameMain}.firebaseio.com/`}, 'main');
    const mainDb = admin.database(mainApp);
    const mainFuncDb = functions.database;

    const exportMap = {main: {}};


    admin.initializeApp(functions.config().firebase);
    // const db = admin.database();
    // const funcDb = functions.database;

    Object.assign(exportMap.main, createUser(undefined, undefined, mainFuncDb, mainDb, functions));
    if (includeCron) {
        Object.assign(exportMap.main, createCron(undefined, undefined, mainFuncDb, mainDb, functions));
    }

    Object.keys(config.apps).forEach(appName => {
        exportMap[appName] = {};
        const dbNameApp = config.apps[appName].dbName;
        const appApp = admin.initializeApp({databaseURL: `https://${dbNameApp}.firebaseio.com/`}, appName);
        const appDb = admin.database(appApp);
        const appFuncDb = functions.database.instance(dbNameApp);

        Object.assign(exportMap[appName], createItem(appFuncDb, appDb, mainFuncDb, mainDb, functions));
        Object.assign(exportMap[appName], createJoin(appFuncDb, appDb, mainFuncDb, mainDb, functions));
    });

    return exportMap;
}

export {createGenericFunctions}
