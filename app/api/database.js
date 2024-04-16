import postgres from 'postgres';
import environment from '../assets/sessions/database-env.json'

const Database = postgres(environment);

export default Database;