
function createFunctions( funcDb, db, mainFuncDb, mainDb, functions ) {


    /**
     *  When a user account is first created in Firebase, create a user record.
     */
    const userCreated = functions.auth.user()
        .onCreate((user) => {
            const userId = user.uid;
            const displayName = (user.displayName ? user.displayName : null);
            const email = (user.email ? user.email : '');
            return Promise.all([
                mainDb.ref(`/users/${userId}`).set({displayName: displayName, email: email}),
                mainDb.ref(`/status/${userId}`).set({verified: false, active: false, host: false, admin: false})
            ]);
        });

    /**
     * When a user record is deleted, delete the corresponding status record.
     */
    const userDeleted = functions.auth.user()
        .onDelete((user) => {
            const userId = user.uid;
            return Promise.all([
                mainDb.ref(`/users/${userId}`).set(null),
                mainDb.ref(`/status/${userId}`).set(null)
            ]);
        });

    return {
        userCreated: userCreated,
        userDeleted: userDeleted
    }
}

export {createFunctions};
