const CRON_NIGHTLY = '30 23 * * *';
const CRON_INTERVAL = 15;
const TIME_ZONE = 'Australia/Melbourne';

const LOG_PREFIX = 'CRON_JOBS';

function createFunctions( localFuncDb, localDb, mainFuncDb, mainDb, functions ) {

    /**
     *  Scheduled task each night.
     */
    function eveningCron(context) {
        console.log(`${LOG_PREFIX} - eveningCron - Performing evening tasks. Time(${context.timestamp})`);
        return null;
    }

    /**
     *  Scheduled task every interval.
     */
    function intervalCron(context) {
        console.log(`${LOG_PREFIX} - eveningCron - Interval cron job: Time(${context.timestamp})`);
        return null;
    }

    return {
        eveningCron: functions.pubsub.schedule(CRON_NIGHTLY).timeZone(TIME_ZONE)
            .onRun((context) => eveningCron(context)),
        intervalCron: functions.pubsub.schedule(`every ${CRON_INTERVAL} minutes`).timeZone(TIME_ZONE)
            .onRun((context) => intervalCron(context))
    };
};

export {createFunctions};