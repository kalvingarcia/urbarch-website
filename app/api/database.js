import postgres from 'postgres';
import environment from '../assets/sessions/database-env.json'

const Database = postgres(environment? 
    environment 
    :
    {
        database: process.env.DBNAME,
        username: process.env.DBUSER,
        password: process.env.DBPASS,
        host: process.env.DBHOST,
        port: process.env.DBPORT,
        ssl: process.env.DBMODE
    }
);

export default Database;