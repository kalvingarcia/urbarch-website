import postgres from 'postgres';
import environment from '../sessions/database-env.json'

const Database = postgres(environment);

export default Database;