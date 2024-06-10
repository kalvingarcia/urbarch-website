import postgres from 'postgres';

let Database;
if(process.env.NODE_ENV === "development")
    Database = await import('../assets/sessions/database-env.json').then(response => {
        return postgres(response);
    });
else
    Database = postgres({
        database: process.env.DBNAME,
        username: process.env.DBUSER,
        password: process.env.DBPASS,
        host: process.env.DBHOST,
        port: process.env.DBPORT,
        ssl: process.env.DBMODE
    }); 
export default Database;