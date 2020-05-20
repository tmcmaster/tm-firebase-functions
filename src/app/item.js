
function createFunctions(localFuncDb, localDb, mainFuncDb, mainDb ) {

    /**
     *  When an item is created, add a record into the corresponding list.
     */
    const itemCreated = localFuncDb.ref(`/{role}/{userId}/item/{type}/{id}`)
        .onCreate((snapshot, context) => {
            const role = context.params.role;
            const userId = context.params.userId;
            const type = context.params.type;
            const id = context.params.id;
            const item = snapshot.val();
            const LOG_PREFIX = `role(${role}), user(${userId}), type(${type}, id(${id})`;
            console.log(`${LOG_PREFIX} - Item was created`, item);
            return new Promise((resolve, reject) => {
                if (role === 'host' || role == 'guest') {
                    const name = (item.name ? item.name : id);
                    console.log(`${LOG_PREFIX} - List record about to be added. name(${name})`);
                    localDb.ref(`/${role}/${userId}/list/${type}/${id}`).set(name).then(() => {
                        console.log(`${LOG_PREFIX} - List record has been added. name(${name})`);
                        resolve();
                    }).catch(error => {
                        console.error(`${LOG_PREFIX} - List record could not be added. name(${name})`, error);
                        reject(error);
                    });
                } else {
                    console.log(`${LOG_PREFIX} - List record not added, because role is not host or guest`);
                    resolve();
                }
            });
    });

    /**
     * If an item is deleted, remove the item from the corresponding list.
     */
    const itemDeleted = localFuncDb.ref(`/{role}/{userId}/item/{type}/{id}`)
        .onDelete((snapshot, context) => {
            const role = context.params.role;
            const userId = context.params.userId;
            const type = context.params.type;
            const id = context.params.id;
            const LOG_PREFIX = `role(${role}), user(${userId}), type(${type}, id(${id})`;
            console.log(`${LOG_PREFIX} - Item was deleted`);
            return new Promise((resolve,reject) => {
                if (role === 'host' || role == 'guest') {
                    console.log(`${LOG_PREFIX} - list record about to be deleted`);
                    localDb.ref(`/${role}/${userId}/list/${type}/${id}`).set(null).then(() => {
                        console.log(`${LOG_PREFIX} - list record has been deleted`);
                        resolve();
                    }).catch(error => {
                        console.error(`${LOG_PREFIX} - could not delete list record`, error);
                        reject(error);
                    });
                } else {
                    console.log(`${LOG_PREFIX} - List record not deleted, because role is not host or guest`);
                    resolve();
                }
            });
    });

    /**
     * If the item name is updated, update the name in the corresponding list.
     */
    const itemUpdated = localFuncDb.ref(`/{role}/{userId}/item/{type}/{id}/name`)
        .onUpdate((change, context) => {
            const role = context.params.role;
            const userId = context.params.userId;
            const type = context.params.type;
            const id = context.params.id;
            const LOG_PREFIX = `role(${role}), user(${userId}), type(${type}, id(${id})`;
            console.log(`${LOG_PREFIX} - Item was updated`);
            return new Promise((resolve, reject) => {
                if (role === 'host' || role == 'guest') {
                    console.log(`${LOG_PREFIX} - about to update list record`);
                    const name = change.after.val();
                    localDb.ref(`/${role}/${userId}/list/${type}/${id}`).set(name).then(() => {
                        console.log(`${LOG_PREFIX} - list record has been updated`);
                        resolve();
                    }).catch(error => {
                        console.error(`${LOG_PREFIX} - could not update list record`, error);
                        reject(error);
                    });
                } else {
                    console.log(`${LOG_PREFIX} - List record not updated, because role is not host or guest`);
                    resolve();
                }
            });
    });

    return {
        itemCreated: itemCreated,
        itemDeleted: itemDeleted,
        itemUpdated: itemUpdated
    };
}

export {createFunctions};