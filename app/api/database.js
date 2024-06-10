import postgres from 'postgres';
import environment from '../assets/sessions/database-env.json'

const Database = postgres(environment? 
    environment 
    :
    {
        database: process.env.DBNAME, //"productdb",
        username: process.env.DBUSER, //"dashboard",
        password: process.env.DBPASS, //"KQrIInGFvRr6Vqm5KF0_Zw",
        host: process.env.DBHOST, //"urban-website-737.jxf.cockroachlabs.cloud",
        port: process.env.DBPORT, //26257,
        ssl: process.env.DBMODE, //true
    }
);

export default Database;