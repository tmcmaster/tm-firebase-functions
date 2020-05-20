function createFunctions(localFuncDb, localDb, mainFuncDb, mainDb ) {

    /**
     * When join is created, add item to corresponding guest.
     */
    const jointCreated = localFuncDb.ref(`/host/{userId}/join/{joint}/{typeId}/{guestId}`)
        .onCreate((snapshot, context) => {
            const userId = context.params.userId;
            const guestId = context.params.guestId;
            const joint = context.params.joint;

            const jointParts = joint.split('-');
            const type = jointParts[0];
            const child = jointParts[1];
            const typeId = context.params.typeId;
            const LOG_PREFIX = `role(host), user(${userId}), type(${type}: ${typeId}, guest(${guestId})`;
            console.log(`${LOG_PREFIX} - Joint created`);
            return new Promise((resolve, reject) => {
                if (child === 'person') {
                    console.log(`${LOG_PREFIX} - About to get the host item.`);
                    localDb.ref(`/host/${userId}/item/${type}/${typeId}`).once('value', (snapshot) => {
                        const item = snapshot.val();
                        console.log(`${LOG_PREFIX} - About to create the guest item.`);
                        localDb.ref(`/guest/${guestId}/item/${type}/${typeId}`).set(item).then(() => {
                            console.log(`${LOG_PREFIX} - Guest item has been created.`);
                            resolve();
                        }).catch((error) => {
                            console.error(`${LOG_PREFIX} - Could not create the guest item.`, error);
                            reject();
                        });
                    }, (error) => {
                        console.error(`${LOG_PREFIX} - Could not get the host item.`, error);
                        reject();
                    });
                } else {
                    console.error(`${LOG_PREFIX} - Was not a person join.`);
                    resolve();
                }

            });
    });

    /**
     * When join is deleted, delete item from corresponding guest.
     */
    const joinDeleted = localFuncDb.ref(`/host/{userId}/join/{joint}/{typeId}/{guestId}`)
        .onDelete((snapshot, context) => {
            const userId = context.params.userId;
            const joint = context.params.joint;
            const typeId = context.params.typeId;
            const guestId = context.params.guestId;

            const jointParts = joint.split('-');
            const type = jointParts[0];
            const child = jointParts[1];

            const LOG_PREFIX = `role(host), user(${userId}), type(${type}:${typeId}, guest(${guestId})`;
            console.log(`${LOG_PREFIX} - Join deleted`);
            return new Promise((resolve, reject) => {
                if (child === 'person') {
                    console.log(`${LOG_PREFIX} - About to delete the guest item.`);
                    localDb.ref(`/guest/${guestId}/item/${type}/${typeId}`).set(null).then(() => {
                        console.log(`${LOG_PREFIX} - Join was removed.`);
                        resolve();
                    }).catch((error) => {
                        console.error(`${LOG_PREFIX} - Could not remove join.`, error);
                        reject();
                    });
                } else {
                    console.error(`${LOG_PREFIX} - Was not a person join.`);
                    resolve();
                }
            });
    });

    return {
        joinCreated: jointCreated,
        joinDeleted: joinDeleted
    }
}

export {createFunctions};