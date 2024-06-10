import postgres from 'postgres';

const SESSIONS_FILENAME = 'database-env.json';

const Database = await import(`../assets/sessions/${SESSIONS_FILENAME}`).then(response => {
    console.log(response);
    return postgres(response);
}).catch(err => {
    console.error("Error loading session module: " + err);
    console.error("Assuming the build is on a server.");
    return postgres({
        database: process.env.DBNAME,
        username: process.env.DBUSER,
        password: process.env.DBPASS,
        host: process.env.DBHOST,
        port: process.env.DBPORT,
        ssl: process.env.DBMODE
    });
});

export default Database;